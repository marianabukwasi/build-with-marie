import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarieAvatar } from "@/components/MarieAvatar";
import { Send, AlertTriangle, Globe } from "lucide-react";
import { toast } from "sonner";

type Msg = { id?: string; role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I am Marie, your personal web developer. I am here to build, launch, and maintain your website. Let us start. What is your business called and what do you do?",
};

export const ChatWorkspace = () => {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [credits, setCredits] = useState<{ daily: number; monthly: number } | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Load history + credits
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (convs && convs.length) {
        setMessages(convs.map((c) => ({ id: c.id, role: c.role as "user" | "assistant", content: c.content })));
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("credits_daily, credits_monthly")
        .eq("user_id", user.id)
        .single();
      if (prof) setCredits({ daily: prof.credits_daily, monthly: prof.credits_monthly });
    })();
  }, [user]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming || !user || !session) return;
    if (credits && (credits.daily <= 0 || credits.monthly <= 0)) {
      toast.error("Out of credits. Buy more from the Credits tab.");
      return;
    }
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setStreaming(true);

    let assistantSoFar = "";
    let creditedOnce = false;
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && creditedOnce) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        creditedOnce = true;
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marie-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (resp.status === 402) {
        toast.error("Out of credits. Buy more from the Credits tab.");
        setStreaming(false);
        return;
      }
      if (resp.status === 429) {
        toast.error("Marie is busy. Try again in a moment.");
        setStreaming(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        toast.error("Marie could not respond.");
        setStreaming(false);
        return;
      }

      // Credits header
      const cd = resp.headers.get("x-credits-daily");
      const cm = resp.headers.get("x-credits-monthly");
      if (cd && cm) setCredits({ daily: parseInt(cd), monthly: parseInt(cm) });

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") { done = true; break; }
          try {
            const j = JSON.parse(payload);
            // Anthropic SSE: content_block_delta { delta: { text } }
            if (j.type === "content_block_delta" && j.delta?.text) upsert(j.delta.text);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong talking to Marie.");
    } finally {
      setStreaming(false);
    }
  };

  const lowCredits = credits && credits.daily <= 10 && credits.daily > 0;
  const noCredits = credits && (credits.daily <= 0 || credits.monthly <= 0);

  return (
    <div className="grid h-full grid-cols-2 gap-4">
      {/* Chat */}
      <div className="flex h-full min-h-0 flex-col rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <MarieAvatar size={28} />
            <div>
              <p className="text-sm font-semibold leading-none">Marie</p>
              <p className="text-xs text-muted-foreground">Your AI web developer</p>
            </div>
          </div>
          {credits && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{credits.daily}</span> daily ·{" "}
              <span className="font-medium text-foreground">{credits.monthly}</span> monthly
            </div>
          )}
        </div>

        {(lowCredits || noCredits) && (
          <div className={`flex items-center gap-2 px-5 py-2 text-xs ${noCredits ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
            <AlertTriangle className="h-3.5 w-3.5" />
            {noCredits ? "You are out of credits. Buy more to keep building." : "Running low on daily credits."}
          </div>
        )}

        <div ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && <MarieAvatar size={28} />}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-accent-gradient text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {streaming && (
            <div className="flex gap-3">
              <MarieAvatar size={28} />
              <div className="rounded-2xl bg-secondary px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="Tell Marie about your business…"
              rows={1}
              className="min-h-[44px] resize-none rounded-xl border-border bg-background"
            />
            <Button
              onClick={send}
              disabled={streaming || !input.trim() || !!noCredits}
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl bg-accent-gradient text-primary-foreground hover:opacity-95"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex h-full min-h-0 flex-col rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Live preview</span>
          <span className="ml-auto text-xs text-muted-foreground">No site yet</span>
        </div>
        <div className="flex flex-1 items-center justify-center surface-light rounded-b-2xl">
          <iframe
            title="Site preview"
            className="h-full w-full rounded-b-2xl"
            srcDoc={`<!doctype html><html><head><style>body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,system-ui;color:#1a1a2e;background:#f5f5f5}.box{text-align:center;max-width:380px;padding:32px}.dot{width:14px;height:14px;border-radius:999px;background:#e94560;margin:0 auto 18px}h2{margin:0 0 8px;font-weight:700}p{margin:0;color:#5a5a72;font-size:14px;line-height:1.5}</style></head><body><div class="box"><div class="dot"></div><h2>Your site will appear here</h2><p>Keep chatting with Marie. As soon as she has enough to work with, your live preview shows up in this panel.</p></div></body></html>`}
          />
        </div>
      </div>
    </div>
  );
};

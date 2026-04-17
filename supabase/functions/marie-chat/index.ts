// Marie streaming chat — calls Anthropic Claude Sonnet 4.6, deducts credits, logs conversation + activity.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Expose-Headers": "x-credits-daily, x-credits-monthly",
};

const MARIE_SYSTEM_PROMPT = `You are Marie, a professional AI web developer. You are warm, direct, and highly capable. You speak in plain language — no technical jargon unless the user asks. You are proactive — you notice things the user has not asked about and raise them. You are transparent — you always explain what you are doing and why. You never make changes without telling the user first. You remember everything about the user's business across every conversation.

Your job is to: ask the right questions to understand the user's business, propose a design direction based on their answers, build their website through conversation, handle all technical setup for them, and maintain their site after launch.

When a user describes their business, ask about: their business name and type, their location and audience, whether they have an existing website, their social media profiles, what pages they need, and their main goal (sell products, take bookings, show portfolio, etc.).

Always be encouraging. Always confirm before making major changes. Always report what you have done when you finish a task. If you cannot do something, say so honestly and suggest an alternative.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Verify user from JWT
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    const body = await req.json();
    const messages: Array<{ role: "user" | "assistant"; content: string }> = body?.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return new Response(JSON.stringify({ error: "no user message" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Service client for credit + logging
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Atomically reset + spend a credit
    const { data: spendRows, error: spendErr } = await admin.rpc("spend_credit", { p_user_id: userId });
    if (spendErr) {
      console.error("spend_credit error", spendErr);
      return new Response(JSON.stringify({ error: "credit check failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const spend = Array.isArray(spendRows) ? spendRows[0] : spendRows;
    if (!spend?.allowed) {
      return new Response(JSON.stringify({ error: "out_of_credits", credits_daily: spend?.credits_daily ?? 0, credits_monthly: spend?.credits_monthly ?? 0 }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-credits-daily": String(spend?.credits_daily ?? 0), "x-credits-monthly": String(spend?.credits_monthly ?? 0) },
      });
    }

    // Save the user message
    await admin.from("conversations").insert({ user_id: userId, role: "user", content: lastUser.content });

    // Anthropic streaming request
    const anthResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2048,
        system: MARIE_SYSTEM_PROMPT,
        stream: true,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!anthResp.ok || !anthResp.body) {
      const t = await anthResp.text();
      console.error("Anthropic error", anthResp.status, t);
      const status = anthResp.status === 429 ? 429 : 500;
      return new Response(JSON.stringify({ error: "anthropic_error", detail: t.slice(0, 500) }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Tee stream: pass through to client AND collect text to persist
    let assistantText = "";
    const reader = anthResp.body.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buf = "";
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            controller.enqueue(value);
            buf += decoder.decode(value, { stream: true });
            let nl: number;
            while ((nl = buf.indexOf("\n")) !== -1) {
              const line = buf.slice(0, nl).replace(/\r$/, "");
              buf = buf.slice(nl + 1);
              if (!line.startsWith("data:")) continue;
              const payload = line.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const j = JSON.parse(payload);
                if (j.type === "content_block_delta" && j.delta?.text) assistantText += j.delta.text;
              } catch { /* ignore */ }
            }
          }
        } catch (e) {
          console.error("stream error", e);
        } finally {
          controller.close();
          // Persist assistant message + log activity (don't block stream)
          try {
            if (assistantText) {
              await admin.from("conversations").insert({ user_id: userId, role: "assistant", content: assistantText });
              await admin.from("activity_log").insert({
                user_id: userId,
                action: "Marie replied",
                description: assistantText.slice(0, 140) + (assistantText.length > 140 ? "…" : ""),
                status: "completed",
              });
            }
          } catch (e) { console.error("persist error", e); }
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "x-credits-daily": String(spend.credits_daily),
        "x-credits-monthly": String(spend.credits_monthly),
      },
    });
  } catch (e) {
    console.error("marie-chat error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Entry = { id: string; action: string; description: string | null; status: "completed" | "pending" | "flagged"; created_at: string };

const statusIcon = {
  completed: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  pending: <Clock className="h-4 w-4 text-amber-400" />,
  flagged: <Flag className="h-4 w-4 text-primary" />,
};

export const ActivityLog = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("activity_log")
        .select("id, action, description, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      setEntries((data as Entry[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="mb-1 text-xl font-bold">Activity Log</h2>
      <p className="mb-6 text-sm text-muted-foreground">Everything Marie has done for you, newest first.</p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No activity yet. Once Marie starts working, you will see every action here.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {entries.map((e) => (
            <li key={e.id} className="flex items-start gap-3 py-3">
              <div className="mt-0.5">{statusIcon[e.status]}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{e.action}</p>
                {e.description && <p className="text-xs text-muted-foreground">{e.description}</p>}
              </div>
              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

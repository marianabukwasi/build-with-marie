import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export const CreditsPanel = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<{ daily: number; monthly: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("credits_daily, credits_monthly")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setCredits({ daily: data.credits_daily, monthly: data.credits_monthly });
      });
  }, [user]);

  const buyCredits = () => {
    toast.info("Stripe checkout will be wired up next. Ready to enable Lovable Payments?");
  };

  if (!credits) return <p className="p-6 text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="mx-auto grid max-w-3xl gap-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-1 text-xl font-bold">Your credits</h2>
        <p className="mb-6 text-sm text-muted-foreground">Daily credits reset at midnight. Monthly credits reset on the 1st.</p>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-sm font-medium">Daily</span>
              <span className="text-sm"><span className="font-bold text-foreground">{credits.daily}</span> <span className="text-muted-foreground">/ 10</span></span>
            </div>
            <Progress value={(credits.daily / 10) * 100} />
          </div>
          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-sm font-medium">Monthly</span>
              <span className="text-sm"><span className="font-bold text-foreground">{credits.monthly}</span> <span className="text-muted-foreground">/ 100</span></span>
            </div>
            <Progress value={(credits.monthly / 100) * 100} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-gradient shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold">Credit pack</p>
            <p className="text-sm text-muted-foreground">50 credits for €5</p>
          </div>
          <Button onClick={buyCredits} className="bg-accent-gradient text-primary-foreground hover:opacity-95">
            Buy credits
          </Button>
        </div>
      </div>
    </div>
  );
};

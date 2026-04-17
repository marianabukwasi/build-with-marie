import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const SettingsPanel = () => {
  const { user } = useAuth();
  const [notify, setNotify] = useState("major");

  return (
    <div className="mx-auto grid max-w-3xl gap-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-1 text-xl font-bold">Notifications</h2>
        <p className="mb-5 text-sm text-muted-foreground">How often should Marie reach out about your site?</p>
        <RadioGroup value={notify} onValueChange={setNotify} className="space-y-2">
          {[
            { v: "everything", l: "Notify me about everything" },
            { v: "major", l: "Major changes only" },
            { v: "weekly", l: "Weekly summary" },
          ].map((o) => (
            <div key={o.v} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <RadioGroupItem value={o.v} id={o.v} />
              <Label htmlFor={o.v} className="flex-1 cursor-pointer text-sm">{o.l}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-1 text-xl font-bold">Integrations</h2>
        <p className="mb-5 text-sm text-muted-foreground">Connect tools Marie can use on your behalf.</p>
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No integrations connected yet.
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-1 text-xl font-bold">Billing</h2>
        <p className="mb-4 text-sm text-muted-foreground">Manage your plan and payment method.</p>
        <Button variant="outline" onClick={() => toast.info("Billing portal will open once payments are enabled.")}>
          Open billing portal
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-1 text-xl font-bold">Account</h2>
        <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{user?.email}</span></p>
      </div>
    </div>
  );
};

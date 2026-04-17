import { Link } from "react-router-dom";
import { ChatWorkspace } from "@/components/ChatWorkspace";
import { MarieAvatar } from "@/components/MarieAvatar";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  return (
    <div className="flex h-screen flex-col bg-hero">
      <header className="flex items-center justify-between border-b border-border bg-card/40 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <MarieAvatar size={28} />
          <span className="text-base font-bold">Ezmarie</span>
        </div>
        <Link to="/dashboard"><Button variant="ghost">Skip to dashboard →</Button></Link>
      </header>
      <main className="min-h-0 flex-1 p-4">
        <ChatWorkspace />
      </main>
    </div>
  );
};

export default Onboarding;

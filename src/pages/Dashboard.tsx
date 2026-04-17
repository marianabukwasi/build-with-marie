import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MarieAvatar } from "@/components/MarieAvatar";
import { ChatWorkspace } from "@/components/ChatWorkspace";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { CreditsPanel } from "@/components/dashboard/CreditsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState("chat");

  return (
    <div className="flex h-screen flex-col bg-hero">
      <header className="flex items-center justify-between border-b border-border bg-card/40 px-6 py-3 backdrop-blur">
        <Link to="/" className="flex items-center gap-2">
          <MarieAvatar size={28} />
          <span className="text-base font-bold">Ezmarie</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground md:inline">{user?.email}</span>
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="min-h-0 flex-1 px-4 pb-4 pt-3">
        <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col">
          <TabsList className="mb-3 self-start">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="min-h-0 flex-1">
            <ChatWorkspace />
          </TabsContent>
          <TabsContent value="activity" className="min-h-0 flex-1 overflow-y-auto">
            <ActivityLog />
          </TabsContent>
          <TabsContent value="credits" className="min-h-0 flex-1 overflow-y-auto">
            <CreditsPanel />
          </TabsContent>
          <TabsContent value="settings" className="min-h-0 flex-1 overflow-y-auto">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;

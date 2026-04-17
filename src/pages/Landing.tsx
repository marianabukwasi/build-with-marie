import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarieAvatar } from "@/components/MarieAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MessageCircle, Rocket, Wrench } from "lucide-react";

const features = [
  { icon: MessageCircle, title: "Build from conversation", desc: "Just talk to Marie. She turns your words into a real website." },
  { icon: Rocket, title: "Goes live in minutes", desc: "Marie handles hosting, domains and the technical bits. You focus on your business." },
  { icon: Wrench, title: "Maintains your site forever", desc: "Updates, edits, fixes. Marie keeps your site fresh, every day." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-hero">
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <MarieAvatar size={36} />
          <span className="text-lg font-bold tracking-tight">Ezmarie</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="ghost" className="text-foreground hover:bg-secondary">Sign in</Button>
          </Link>
        </div>
      </header>

      <main className="container flex flex-col items-center pt-16 pb-24 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" /> Meet Marie — your AI web developer
        </span>

        <h1 className="text-7xl font-extrabold tracking-tight md:text-9xl">
          <span className="bg-accent-gradient bg-clip-text text-transparent">MARIE</span>
        </h1>

        <p className="mt-6 max-w-2xl text-2xl font-medium text-foreground md:text-3xl">
          Your AI Web Developer.
          <br />
          <span className="text-muted-foreground">Talk. She Builds.</span>
        </p>

        <Link to="/auth" className="mt-10">
          <Button size="lg" className="h-14 rounded-full bg-accent-gradient px-8 text-base font-semibold text-primary-foreground shadow-glow hover:opacity-95">
            Start Building Free
          </Button>
        </Link>

        <div className="mt-24 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 text-left shadow-soft">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gradient shadow-glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="container py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ezmarie. Built by Marie.
      </footer>
    </div>
  );
};

export default Landing;

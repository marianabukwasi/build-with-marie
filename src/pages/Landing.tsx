import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MarieAvatar } from "@/components/MarieAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuraBackground } from "@/components/AuraBackground";
import { Zap, Sparkles, Wrench, ArrowRight, Check } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Speed",
    desc: "Your site goes live in minutes, not months. Marie ships at the speed of thought.",
    accent: "primary" as const,
  },
  {
    icon: Sparkles,
    title: "AI-Integration",
    desc: "Built-in conversational intelligence. Marie connects, configures and adapts as you grow.",
    accent: "accent" as const,
  },
  {
    icon: Wrench,
    title: "Forever Maintained",
    desc: "Updates, edits, fixes — handled. Marie keeps your site fresh, secure and on-brand, every day.",
    accent: "primary" as const,
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AuraBackground />

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full">
        <div className="container mt-4">
          <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <MarieAvatar size={32} />
              <span className="text-base font-bold tracking-tight">Ezmarie</span>
            </div>
            <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
              <a href="#process" className="transition-colors hover:text-foreground">Process</a>
              <a href="#showcase" className="transition-colors hover:text-foreground">Showcase</a>
              <a href="#cta" className="transition-colors hover:text-foreground">Pricing</a>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="rounded-full">Sign in</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container relative pt-20 pb-32">
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          <motion.span
            variants={item}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Meet Marie — the AI that builds websites
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-8 text-5xl font-extrabold leading-[0.95] tracking-tighter sm:text-7xl md:text-8xl"
          >
            <span className="block">We Build Your</span>
            <span className="text-gradient block">Perfect Website.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            A premium AI web developer for small businesses. Talk to Marie — she designs,
            ships, and maintains a site that actually wins customers.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link to="/auth">
              <Button
                size="lg"
                className="glow-pulse h-14 rounded-full bg-accent-gradient px-8 text-base font-semibold text-primary-foreground hover:opacity-95"
              >
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <a href="#process">
              <Button
                size="lg"
                variant="outline"
                className="glass h-14 rounded-full border-border/60 px-8 text-base font-medium"
              >
                See how it works
              </Button>
            </a>
          </motion.div>

          {/* Glass mockup */}
          <motion.div
            variants={item}
            className="relative mt-20 w-full max-w-5xl"
            id="showcase"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-accent-gradient opacity-30 blur-3xl" />
            <div className="glass animate-float relative rounded-3xl p-3 shadow-soft">
              {/* Browser chrome */}
              <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                </div>
                <div className="rounded-md bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                  bloom-florals.ezmarie.app
                </div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
              {/* Mock site */}
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <div className="text-xs font-medium uppercase tracking-widest text-primary">Boutique Florist</div>
                  <div className="mt-2 text-2xl font-bold sm:text-3xl">Bloom & Petal Studio</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Hand-tied bouquets, weddings & weekly subscriptions in Brooklyn.
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-accent-gradient px-3 py-1 text-xs font-semibold text-primary-foreground">Order today</span>
                    <span className="glass rounded-full px-3 py-1 text-xs">Subscriptions</span>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-xl bg-accent-gradient opacity-80" style={{ filter: `hue-rotate(${i * 30}deg)` }} />
                    ))}
                  </div>
                </div>
                <div className="glass rounded-2xl p-4">
                  <div className="text-xs font-semibold text-muted-foreground">This week</div>
                  <div className="mt-2 text-3xl font-bold">+184%</div>
                  <div className="text-xs text-muted-foreground">Bookings via site</div>
                  <div className="mt-4 space-y-2">
                    {["SEO synced", "Stripe live", "Domain attached"].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-xs">
                        <Check className="h-3.5 w-3.5 text-accent" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Bento grid */}
        <section id="process" className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The Perfect Process</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Three things, done right.</h2>
            <p className="mt-4 text-muted-foreground">
              Most agencies take months. Marie does it in minutes — and never stops improving your site.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-12 grid gap-5 md:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className="glass group relative overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-60"
                  style={{
                    background:
                      f.accent === "primary"
                        ? "hsl(var(--primary))"
                        : "hsl(var(--accent))",
                  }}
                />
                <div
                  className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      f.accent === "primary"
                        ? "hsl(var(--primary) / 0.15)"
                        : "hsl(var(--accent) / 0.15)",
                    color:
                      f.accent === "primary"
                        ? "hsl(var(--primary))"
                        : "hsl(var(--accent))",
                    boxShadow:
                      f.accent === "primary"
                        ? "0 0 30px hsl(var(--primary) / 0.35)"
                        : "0 0 30px hsl(var(--accent) / 0.35)",
                  }}
                >
                  <f.icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h3 className="relative text-xl font-semibold">{f.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <section id="cta" className="mt-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] p-10 text-center sm:p-16"
          >
            <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
            <div className="relative">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Your perfect website is <span className="text-gradient">one chat away.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                No briefs. No designers. No deadlines. Just talk to Marie.
              </p>
              <div className="mt-8 flex justify-center">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="glow-pulse h-14 rounded-full bg-accent-gradient px-10 text-base font-semibold text-primary-foreground hover:opacity-95"
                  >
                    Start Building Free
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="container border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ezmarie. Built by Marie.
      </footer>
    </div>
  );
};

export default Landing;

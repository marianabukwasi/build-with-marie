import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MarieAvatar } from "@/components/MarieAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuraBackground } from "@/components/AuraBackground";
import { SiteMarquee } from "@/components/SiteMarquee";
import { MessagesSquare, Rocket, ShieldCheck, ArrowRight, Check } from "lucide-react";

const features = [
  {
    icon: MessagesSquare,
    title: "Just talk. No code.",
    desc: "Describe your business in plain English. Marie writes, designs and ships your site — you never touch a line of code.",
  },
  {
    icon: Rocket,
    title: "Live in minutes.",
    desc: "Hosting, domain, SEO, forms, payments. Marie wires it all up the moment you're ready to launch.",
  },
  {
    icon: ShieldCheck,
    title: "Maintained forever.",
    desc: "Marie watches your site 24/7 — fixing, updating, refreshing copy and images so it always feels brand new.",
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
              <span className="text-base font-bold tracking-tight">EZMARIE</span>
            </div>
            <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
              <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
              <a href="#showcase" className="transition-colors hover:text-foreground">Showcase</a>
              <a href="#cta" className="transition-colors hover:text-foreground">Get started</a>
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
          <motion.h1
            variants={item}
            className="text-5xl font-extrabold leading-[0.95] tracking-tighter sm:text-7xl md:text-8xl"
          >
            <span className="block">The perfect website,</span>
            <span className="text-gradient block">built &amp; maintained for you.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Ezmarie is your AI web developer. One conversation, one place — Marie builds,
            launches and looks after your website forever. No code. No agencies. No upkeep.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link to="/auth">
              <Button
                size="lg"
                className="glow-pulse h-14 rounded-full bg-pink-gradient px-8 text-base font-semibold text-primary-foreground hover:opacity-95"
              >
                Start building free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how">
              <Button
                size="lg"
                variant="outline"
                className="glass h-14 rounded-full border-border/60 px-8 text-base font-medium"
              >
                See how it works
              </Button>
            </a>
          </motion.div>

          {/* Hero showcase — tilted, perspective marquees */}
          <motion.div
            variants={item}
            className="relative mt-20 w-full"
            id="showcase"
            style={{ perspective: "1400px" }}
          >
            <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 rounded-[3rem] bg-accent-gradient opacity-25 blur-3xl" />
            <div
              className="relative space-y-5"
              style={{ transform: "rotateX(14deg) rotateZ(-2deg)" }}
            >
              <SiteMarquee speed={50} compact />
              <SiteMarquee speed={65} compact reverse />
            </div>
            {/* Bottom fade into page */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
          </motion.div>
        </motion.section>

        {/* Bento grid */}
        <section id="how" className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">How Ezmarie works</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Build &amp; maintain — in one place.
            </h2>
            <p className="mt-4 text-muted-foreground">
              You don't need a developer. You don't need a designer. You just need to talk to Marie.
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
                  style={{ background: "hsl(var(--accent))" }}
                />
                <div
                  className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: "hsl(var(--accent) / 0.14)",
                    color: "hsl(var(--accent))",
                    boxShadow: "0 0 30px hsl(var(--accent) / 0.30)",
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

        {/* Live showcase marquees */}
        <section className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Live from Marie
            </div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Sites built this week.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Real businesses. Real launches. All shipped through one conversation.
            </p>
          </motion.div>

          <div className="relative -mx-4 mt-12 space-y-5 sm:-mx-8">
            <SiteMarquee speed={55} />
            <SiteMarquee speed={70} reverse />
          </div>
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
                Built by Marie. Maintained by Marie. Owned by you.
              </p>
              <div className="mt-8 flex justify-center">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="glow-pulse h-14 rounded-full bg-pink-gradient px-10 text-base font-semibold text-primary-foreground hover:opacity-95"
                  >
                    Start building free
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

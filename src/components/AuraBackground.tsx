import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Animated mesh gradient + mouse-reactive floating particles.
 * Pure decoration — pointer-events disabled.
 */
export const AuraBackground = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Deterministic particle positions
  const particles = Array.from({ length: 22 }, (_, i) => ({
    left: (i * 53) % 100,
    top: (i * 37) % 100,
    size: 2 + (i % 4),
    delay: (i % 7) * 0.6,
    duration: 6 + (i % 5),
  }));

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--mx" as any]: "0px", ["--my" as any]: "0px" }}
    >
      {/* Mesh gradient layer */}
      <div className="absolute inset-0 bg-mesh animate-mesh" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Particles */}
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{ transform: "translate3d(var(--mx), var(--my), 0)" }}
      >
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-foreground/60"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px hsl(var(--primary) / 0.6)",
            }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
    </div>
  );
};

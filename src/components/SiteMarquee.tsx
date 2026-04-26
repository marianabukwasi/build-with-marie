import { motion } from "framer-motion";
import { Check, Star, ShoppingBag, Calendar, Coffee, Dumbbell, Scissors, Camera } from "lucide-react";

type Mock = {
  name: string;
  url: string;
  category: string;
  tag: string;
  icon: typeof Check;
  hue: number;
};

const MOCKS: Mock[] = [
  { name: "Bloom & Petal", url: "bloom.ezmarie.app", category: "Florist", tag: "Order today", icon: ShoppingBag, hue: 320 },
  { name: "Northside Coffee", url: "northside.ezmarie.app", category: "Cafe", tag: "Open now", icon: Coffee, hue: 25 },
  { name: "Apex Fitness", url: "apex.ezmarie.app", category: "Gym", tag: "Book a class", icon: Dumbbell, hue: 200 },
  { name: "Studio Lumen", url: "lumen.ezmarie.app", category: "Photography", tag: "View portfolio", icon: Camera, hue: 260 },
  { name: "Maison Hair", url: "maison.ezmarie.app", category: "Salon", tag: "Reserve", icon: Scissors, hue: 340 },
  { name: "Harbor Dental", url: "harbor.ezmarie.app", category: "Clinic", tag: "Book visit", icon: Calendar, hue: 190 },
];

const SiteCard = ({ m, compact = false }: { m: Mock; compact?: boolean }) => (
  <div
    className={`glass shrink-0 overflow-hidden rounded-2xl shadow-soft ${
      compact ? "w-[280px]" : "w-[360px]"
    }`}
  >
    {/* Browser chrome */}
    <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-primary/70" />
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
      </div>
      <div className="rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
        {m.url}
      </div>
      <span className="text-[10px] text-muted-foreground">Live</span>
    </div>
    {/* Hero band */}
    <div
      className="relative h-20 w-full"
      style={{
        background: `linear-gradient(135deg, hsl(${m.hue} 80% 60%), hsl(${
          (m.hue + 40) % 360
        } 80% 55%))`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
    </div>
    {/* Body */}
    <div className="space-y-3 p-4">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-accent">
          {m.category}
        </div>
        <div className="mt-1 text-base font-bold leading-tight">{m.name}</div>
      </div>
      <div className="flex items-center gap-1.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-primary text-primary" />
        ))}
        <span className="text-[10px] text-muted-foreground">5.0 · 248 reviews</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-pink-gradient px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
          <m.icon className="mr-1 inline h-2.5 w-2.5" />
          {m.tag}
        </span>
        <span className="glass rounded-full px-2 py-1 text-[10px]">Menu</span>
      </div>
      {!compact && (
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-md"
              style={{
                background: `linear-gradient(135deg, hsl(${
                  (m.hue + i * 25) % 360
                } 70% 55%), hsl(${(m.hue + i * 25 + 30) % 360} 70% 65%))`,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

/**
 * Marquee — infinite horizontal scroll. `reverse` flips direction.
 * `compact` switches to smaller cards (used in background).
 */
export const SiteMarquee = ({
  reverse = false,
  speed = 60,
  compact = false,
  className = "",
}: {
  reverse?: boolean;
  speed?: number;
  compact?: boolean;
  className?: string;
}) => {
  const loop = [...MOCKS, ...MOCKS];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-5 w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {loop.map((m, i) => (
          <SiteCard key={`${m.name}-${i}`} m={m} compact={compact} />
        ))}
      </motion.div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
};

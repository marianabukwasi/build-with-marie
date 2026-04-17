import { cn } from "@/lib/utils";

export const MarieAvatar = ({ size = 32, className }: { size?: number; className?: string }) => (
  <div
    className={cn(
      "flex shrink-0 items-center justify-center rounded-full bg-accent-gradient font-bold text-primary-foreground shadow-glow",
      className,
    )}
    style={{ width: size, height: size, fontSize: size * 0.45 }}
  >
    M
  </div>
);

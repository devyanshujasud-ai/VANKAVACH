import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const btn = cva(
  "inline-flex items-center justify-center gap-2 font-display uppercase tracking-[0.12em] font-semibold rounded-sm transition-all disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:brightness-110 glow-primary",
        alert: "bg-alert text-alert-foreground hover:brightness-110",
        outline: "border border-primary/50 text-primary hover:bg-primary/10",
        alertOutline: "border border-alert/60 text-alert hover:bg-alert/10",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-accent",
        paper: "bg-paper-foreground text-paper hover:brightness-125",
      },
      size: { sm: "h-7 px-3 text-xs", md: "h-9 px-4 text-sm", lg: "h-11 px-6 text-base", icon: "h-8 w-8" },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);
export function VkButton({ className, variant, size, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof btn>) {
  return <button className={cn(btn({ variant, size }), className)} {...p} />;
}

export function Panel({ title, right, children, className }: { title?: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("vk-panel flex flex-col min-h-0", className)}>
      {title && (
        <header className="flex items-center justify-between border-b border-border px-3 py-2">
          <h3 className="vk-title text-sm text-foreground">{title}</h3>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export function SevBadge({ s }: { s: string }) {
  const cls = s === "HIGH" ? "bg-alert/15 text-alert border-alert/50" : s === "MEDIUM" ? "bg-alert/5 text-alert/80 border-alert/30" : "bg-primary/10 text-primary border-primary/30";
  return <span className={cn("font-mono text-[10px] px-1.5 py-0.5 border rounded-sm tracking-wider", cls)}>{s}</span>;
}

export function Meta({ k, v, tone }: { k: string; v: ReactNode; tone?: "alert" | "primary" | undefined }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1 border-b border-border/50 last:border-0">
      <span className="vk-label">{k}</span>
      <span className={cn("font-mono text-xs text-right", tone === "alert" && "text-alert", tone === "primary" && "text-primary")}>{v}</span>
    </div>
  );
}

export function Gauge({ value, label, tone = "primary", size = 88 }: { value: number; label: string; tone?: "primary" | "alert"; size?: number }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} className="fill-none stroke-muted" strokeWidth="5" />
        <circle cx="40" cy="40" r={r} className={cn("fill-none transition-all duration-700", tone === "alert" ? "stroke-alert" : "stroke-primary")} strokeWidth="5" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} strokeLinecap="butt" transform="rotate(-90 40 40)" />
        <text x="40" y="44" textAnchor="middle" className="fill-foreground font-mono" fontSize="14">{value}%</text>
      </svg>
      <span className="vk-label text-center">{label}</span>
    </div>
  );
}

export function Crumbs({ items }: { items: string[] }) {
  return (
    <nav className="vk-label flex items-center gap-1.5" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it} className={cn(i === items.length - 1 && "text-primary")}>{i > 0 && <span className="mr-1.5 opacity-50">/</span>}{it}</span>
      ))}
    </nav>
  );
}

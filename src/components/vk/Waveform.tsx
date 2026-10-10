import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function WaveformChart({ data, className, tone = "primary", animate = true, height = 60, offset = 0, strokeWidth = 1.4 }: {
  data: number[]; className?: string; tone?: "primary" | "alert" | "wave"; animate?: boolean; height?: number; offset?: number; strokeWidth?: number;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 1000), 90);
    return () => clearInterval(id);
  }, [animate]);
  const w = 400, n = data.length;
  const pts = data.map((v, i) => {
    const jitter = animate ? Math.sin((i + tick) * 0.9) * 0.04 : 0;
    return `${((i / (n - 1)) * w + offset).toFixed(1)},${(height / 2 - (v + jitter) * (height / 2.2)).toFixed(1)}`;
  }).join(" ");
  const stroke = tone === "alert" ? "stroke-alert" : tone === "wave" ? "stroke-wave" : "stroke-primary";
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className={cn("w-full", className)} style={{ height }}>
      <line x1="0" x2={w} y1={height / 2} y2={height / 2} className="stroke-current opacity-15" strokeDasharray="2 4" />
      <polyline points={pts} className={cn("fill-none", stroke)} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      {animate && <line x1={(tick * 4) % w} x2={(tick * 4) % w} y1="0" y2={height} className="stroke-current opacity-25" />}
    </svg>
  );
}

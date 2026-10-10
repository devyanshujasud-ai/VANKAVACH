import { useRef, type ReactNode } from "react";
import { Maximize2, Minus, Plus, Crosshair } from "lucide-react";
import { MAP_H, MAP_W } from "@/lib/vk-data";
import { cn } from "@/lib/utils";

export type View = { k: number; cx: number; cy: number };
export const HOME: View = { k: 1, cx: MAP_W / 2, cy: MAP_H / 2 };

/** convert map coords to % of container for HTML overlays */
export function toPct(v: View, x: number, y: number) {
  return { left: `${(((x - v.cx) * v.k + MAP_W / 2) / MAP_W) * 100}%`, top: `${(((y - v.cy) * v.k + MAP_H / 2) / MAP_H) * 100}%` };
}

function Terrain() {
  return (
    <g>
      <defs>
        <filter id="vk-noise"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="7" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" /></filter>
        <filter id="vk-fine"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" /></filter>
        <pattern id="vk-gridp" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" className="fill-none stroke-primary" strokeOpacity="0.07" /></pattern>
      </defs>
      <rect x="-1000" y="-1000" width={MAP_W + 2000} height={MAP_H + 2000} className="fill-terrain" />
      <path d="M-200 80 C150 30 260 260 470 210 S760 60 1200 140 L1200 -200 L-200 -200Z" className="fill-terrain-2" opacity="0.7" />
      <path d="M-200 700 C120 560 300 640 520 560 S860 470 1200 620 L1200 900 L-200 900Z" className="fill-terrain-2" opacity="0.6" />
      <rect x="-1000" y="-1000" width={MAP_W + 2000} height={MAP_H + 2000} filter="url(#vk-noise)" />
      <rect x="-1000" y="-1000" width={MAP_W + 2000} height={MAP_H + 2000} filter="url(#vk-fine)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx="760" cy="200" rx={60 + i * 38} ry={36 + i * 24} className="fill-none stroke-primary" strokeOpacity={0.08} transform="rotate(-18 760 200)" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={`b${i}`} cx="230" cy="420" rx={50 + i * 34} ry={30 + i * 22} className="fill-none stroke-primary" strokeOpacity={0.07} transform="rotate(24 230 420)" />
      ))}
      <path d="M-50 380 C90 360 170 300 260 340 S420 430 520 420 S700 470 760 600 S820 700 900 760" className="fill-none stroke-water" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
      <path d="M-50 380 C90 360 170 300 260 340 S420 430 520 420 S700 470 760 600 S820 700 900 760" className="fill-none stroke-water" strokeWidth="2" opacity="0.9" />
      <path d="M40 -20 L200 160 L480 250 L700 360 L1050 420" className="fill-none stroke-muted-foreground" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 5" />
      <path d="M600 -20 C620 120 560 200 600 330 S780 520 820 700" className="fill-none stroke-muted-foreground" strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="3 4" />
      <rect x="-1000" y="-1000" width={MAP_W + 2000} height={MAP_H + 2000} fill="url(#vk-gridp)" />
      <g className="fill-muted-foreground font-mono" fontSize="10" opacity="0.6" letterSpacing="2">
        <text x="70" y="250">KANHAR RIDGE</text>
        <text x="700" y="90">SALT LICK PLATEAU</text>
        <text x="300" y="400" transform="rotate(12 300 400)">MAHUA NALLAH</text>
        <text x="830" y="610">SOUTHERN TRACK</text>
        <text x="470" y="250">COMPARTMENT C2</text>
        <text x="610" y="470">COMPARTMENT C3</text>
      </g>
    </g>
  );
}

export function TerrainMap({ view, setView, children, overlay, className }: {
  view: View; setView: (v: View) => void; children?: ReactNode; overlay?: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const zoom = (d: number) => setView({ ...view, k: Math.min(3.5, Math.max(0.8, +(view.k * d).toFixed(2))) });
  const full = () => { const el = ref.current; if (!el) return; if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.(); };
  const tf = `translate(${MAP_W / 2}px, ${MAP_H / 2}px) scale(${view.k}) translate(${-view.cx}px, ${-view.cy}px)`;
  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-terrain", className)}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g style={{ transform: tf, transition: "transform 700ms cubic-bezier(.2,.8,.2,1)" }}>
          <Terrain />
          {children}
        </g>
      </svg>
      {overlay}
      <div className="absolute right-3 bottom-14 flex flex-col vk-panel">
        <button aria-label="Zoom in" onClick={() => zoom(1.3)} className="p-2 hover:bg-accent text-muted-foreground hover:text-primary"><Plus size={15} /></button>
        <button aria-label="Zoom out" onClick={() => zoom(1 / 1.3)} className="p-2 hover:bg-accent text-muted-foreground hover:text-primary border-t border-border"><Minus size={15} /></button>
        <button aria-label="Recenter" onClick={() => setView(HOME)} className="p-2 hover:bg-accent text-muted-foreground hover:text-primary border-t border-border"><Crosshair size={15} /></button>
        <button aria-label="Fullscreen" onClick={full} className="p-2 hover:bg-accent text-muted-foreground hover:text-primary border-t border-border"><Maximize2 size={15} /></button>
      </div>
      <div className="absolute right-16 bottom-4 flex items-end gap-2 vk-label">
        <div className="flex flex-col items-start"><div className="h-1.5 w-24 border border-t-0 border-muted-foreground" /><span className="mt-1">{(1.2 / view.k).toFixed(2)} km</span></div>
        <span className="opacity-70">ZOOM {view.k.toFixed(1)}×</span>
      </div>
    </div>
  );
}

export function SensorMarker({ x, y, status, selected, label, onClick, k = 1 }: { x: number; y: number; status: "online" | "offline" | "alert"; selected?: boolean; label?: string; onClick?: () => void; k?: number }) {
  const s = 1 / Math.sqrt(k);
  const tone = status === "alert" ? "fill-alert stroke-alert" : status === "offline" ? "fill-muted-foreground stroke-muted-foreground" : "fill-primary stroke-primary";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} onClick={onClick} className="cursor-pointer" role="button" aria-label={label}>
      <circle r="16" className={cn(tone, "anim-pulse")} fillOpacity="0.12" strokeOpacity="0.4" />
      {status === "alert" && <circle r="14" className="fill-none stroke-alert anim-ring" strokeWidth="2" />}
      <circle r="5.5" className={tone} />
      {selected && <circle r="11" className="fill-none stroke-foreground" strokeWidth="1.3" strokeDasharray="3 2" />}
      {label && <text x="12" y="-10" className="fill-foreground font-mono" fontSize="10">{label}</text>}
    </g>
  );
}

import { useMemo, useState } from "react";
import { X, Plus, Minus, Maximize, Search } from "lucide-react";
import { GRAPH_NODES, GRAPH_EDGES, type GNode, type GEdge } from "@/lib/vk-data";
import { VkButton } from "./ui";
import { cn } from "@/lib/utils";

const CAT: Record<GNode["cat"], string> = {
  incident: "fill-alert stroke-alert", lead: "fill-alert stroke-alert", sensor: "fill-primary stroke-primary",
  report: "fill-foreground stroke-foreground", location: "fill-water stroke-primary", entity: "fill-muted-foreground stroke-muted-foreground",
};
const node = (id: string) => GRAPH_NODES.find((n) => n.id === id)!;

export function RelationshipGraph({ filter = "all", compact = false, onSelect }: { filter?: GEdge["kind"] | "all"; compact?: boolean; onSelect?: (n: GNode) => void }) {
  const [sel, setSel] = useState<string | null>(compact ? null : "DEMO-017");
  const [edge, setEdge] = useState<GEdge | null>(null);
  const [q, setQ] = useState("");
  const [k, setK] = useState(1);
  const edges = GRAPH_EDGES.filter((e) => filter === "all" || e.kind === filter);
  const visible = useMemo(() => new Set(edges.flatMap((e) => [e.a, e.b])), [edges]);
  const nodes = GRAPH_NODES.filter((n) => filter === "all" || visible.has(n.id));
  const hits = q ? new Set(nodes.filter((n) => `${n.id} ${n.label}`.toLowerCase().includes(q.toLowerCase())).map((n) => n.id)) : null;
  const linked = sel ? new Set(edges.filter((e) => e.a === sel || e.b === sel).flatMap((e) => [e.a, e.b])) : null;
  const selNode = sel ? node(sel) : null;
  const path = (e: GEdge) => { const A = node(e.a), B = node(e.b); const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2; const dx = B.y - A.y, dy = A.x - B.x; return `M${A.x},${A.y} Q${mx + dx * 0.15},${my + dy * 0.15} ${B.x},${B.y}`; };
  const pick = (n: GNode) => { setSel(n.id); setEdge(null); onSelect?.(n); };

  return (
    <div className="relative h-full w-full overflow-hidden bg-background/60">
      <svg viewBox="40 60 980 560" className="h-full w-full">
        <g style={{ transform: `scale(${k})`, transformOrigin: "530px 340px", transition: "transform 300ms" }}>
          {edges.map((e, i) => {
            const on = !linked || (linked.has(e.a) && linked.has(e.b) && (e.a === sel || e.b === sel));
            const amber = e.kind === "intelligence" || e.a.startsWith("DEMO") || e.b.startsWith("DEMO");
            return (
              <g key={i} onClick={() => setEdge(e)} className="cursor-pointer">
                <path d={path(e)} className="fill-none stroke-transparent" strokeWidth="10" />
                <path d={path(e)} className={cn("fill-none", amber ? "stroke-alert" : "stroke-primary", on && sel && "anim-dash")} strokeOpacity={on ? 0.8 : 0.1} strokeWidth={edge === e ? 2.6 : 1.3} strokeDasharray={on && sel ? "6 4" : undefined} />
              </g>
            );
          })}
          {nodes.map((n) => {
            const dim = (linked && !linked.has(n.id)) || (hits && !hits.has(n.id));
            const big = n.cat === "incident" || n.cat === "lead";
            return (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`} onClick={() => pick(n)} className="cursor-pointer" opacity={dim ? 0.2 : 1}>
                {sel === n.id && <circle r={big ? 22 : 15} className="fill-none stroke-foreground" strokeDasharray="3 3" />}
                {hits?.has(n.id) && <circle r={big ? 26 : 18} className="fill-none stroke-primary anim-ring" />}
                <circle r={big ? 14 : 8} className={CAT[n.cat]} fillOpacity={big ? 0.85 : 0.75} strokeOpacity="0.5" strokeWidth="4" />
                <text y={big ? 30 : 22} textAnchor="middle" className="fill-foreground font-mono" fontSize="11">{n.label}</text>
                <text y={big ? 43 : 34} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="9">{n.id}</text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute left-3 top-3 flex items-center gap-2">
        <label className="flex h-8 items-center gap-2 border border-border bg-panel px-2"><Search size={13} className="text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search nodes…" className="w-36 bg-transparent text-xs outline-none" /></label>
        <div className="flex vk-panel">
          <button aria-label="Zoom in" className="p-2 hover:bg-accent" onClick={() => setK((x) => Math.min(2.2, x + 0.2))}><Plus size={13} /></button>
          <button aria-label="Zoom out" className="border-l border-border p-2 hover:bg-accent" onClick={() => setK((x) => Math.max(0.6, x - 0.2))}><Minus size={13} /></button>
          <button aria-label="Fit to view" className="border-l border-border p-2 hover:bg-accent" onClick={() => { setK(1); setSel(null); setEdge(null); setQ(""); }}><Maximize size={13} /></button>
        </div>
      </div>
      {!compact && (
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 vk-panel px-3 py-2">
          {([["incident", "Incident / Lead"], ["sensor", "Sensor"], ["report", "Report"], ["location", "Location"], ["entity", "Entity (fictional)"]] as const).map(([c, l]) => (
            <span key={c} className="flex items-center gap-1.5 vk-label"><svg width="10" height="10"><circle cx="5" cy="5" r="4" className={CAT[c]} /></svg>{l}</span>
          ))}
        </div>
      )}
      {(selNode || edge) && !compact && (
        <div className="anim-in absolute right-3 top-3 w-72 vk-panel p-3 shadow-2xl">
          <div className="flex items-center justify-between"><span className="vk-label">{edge ? "Relationship evidence" : selNode!.cat}</span><button aria-label="Close detail" onClick={() => { setSel(null); setEdge(null); }}><X size={13} /></button></div>
          {edge ? (
            <>
              <div className="mt-1 font-mono text-xs text-primary">{edge.a} ↔ {edge.b}</div>
              <p className="mt-2 text-sm">{edge.note}</p>
              <div className="mt-2 vk-label">Layer: {edge.kind} · Source: simulated record set v1</div>
              <p className="mt-2 text-xs text-muted-foreground">Evidence summary: association derived from fictional metadata overlap. Not proof of wrongdoing; requires analyst review.</p>
            </>
          ) : (
            <>
              <div className="vk-title mt-1 text-lg">{selNode!.label}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{selNode!.id}</div>
              <p className="mt-2 text-xs">{selNode!.detail}</p>
              <div className="mt-2 vk-label">Connections: {edges.filter((e) => e.a === sel || e.b === sel).length}</div>
              <ul className="mt-1 space-y-1">
                {edges.filter((e) => e.a === sel || e.b === sel).map((e, i) => (
                  <li key={i}><button onClick={() => setEdge(e)} className="w-full text-left font-mono text-[11px] text-primary hover:underline">→ {e.a === sel ? e.b : e.a}: {e.note}</button></li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function CrossReferenceModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<GEdge["kind"]>("intelligence");
  const counts = { operations: 0, reports: 0, intelligence: 0 } as Record<GEdge["kind"], number>;
  GRAPH_EDGES.forEach((e) => counts[e.kind]++);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/75 p-6 backdrop-blur-sm">
      <div className="anim-in flex h-[86vh] w-full max-w-[1400px] flex-col vk-panel">
        <header className="flex items-center gap-4 border-b border-border px-5 py-3">
          <h2 className="vk-title text-2xl">Cross-Reference Analysis</h2>
          <div className="flex">
            {(["operations", "reports", "intelligence"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("vk-title border-b-2 px-4 py-1 text-sm", tab === t ? "border-alert text-alert" : "border-transparent text-muted-foreground hover:text-foreground")}>{t} <span className="font-mono text-[10px]">({counts[t]})</span></button>
            ))}
          </div>
          <VkButton variant="ghost" size="sm" className="ml-auto" onClick={onClose}><X size={14} />Close</VkButton>
        </header>
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px]">
          <RelationshipGraph key={tab} filter={tab} />
          <aside className="border-l border-border p-4 text-sm">
            <div className="vk-label">Relationship summary</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="border border-border p-2"><div className="vk-label">Nodes</div><div className="font-mono text-xl">{GRAPH_NODES.length}</div></div>
              <div className="border border-border p-2"><div className="vk-label">Links</div><div className="font-mono text-xl">{GRAPH_EDGES.length}</div></div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {tab === "operations" && "Sensor and location links around DEMO-001. Nodes A and B form the strongest pair."}
              {tab === "reports" && "Fictional patrol and vehicle reports chain toward the southern track."}
              {tab === "intelligence" && "DEMO-017 overlaps DEMO-001 in time and region only. Overlap is not evidence of causation."}
            </p>
            <div className="mt-4 border-l-2 border-alert bg-alert/5 p-2 text-xs">Click any node to highlight its links, or click a line to read the evidence summary.</div>
            <div className="mt-4 vk-label">All entities are synthetic.</div>
          </aside>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Play, Download, GitCompare, AlertTriangle, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useVk } from "@/lib/vk-store";
import { genWave, sensorById, NODE_A, NODE_B } from "@/lib/vk-data";
import { WaveformChart } from "@/components/vk/Waveform";
import { VkButton, Crumbs, Gauge } from "@/components/vk/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/correlation")({
  head: () => ({
    meta: [
      { title: "AI Signal Correlation | VANKAVACH" },
      { name: "description", content: "Compare independent acoustic sensor reports with simulated temporal and signal similarity analysis." },
      { property: "og:title", content: "AI Signal Correlation | VANKAVACH" },
      { property: "og:description", content: "Simulated cross-verification of two sensor node reports." },
    ],
  }),
  component: Correlation,
});

const WA = genWave(14, 140, 62, 1);
const WB = genWave(17, 140, 70, 0.85);
const RESULT = 87.4;

function SensorCard({ id, wave, time, delta }: { id: string; wave: number[]; time: string; delta: string }) {
  const s = sensorById(id);
  return (
    <div className="flex-1 bg-paper p-4 text-paper-foreground shadow-2xl">
      <div className="flex items-center justify-between"><span className="vk-title text-xl">{s.label}</span><span className="font-mono text-[10px] text-paper-muted">{s.id}</span></div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-paper-muted">{s.name} · {s.zone} · {s.type}</div>
      <WaveformChart data={wave} tone="wave" height={90} className="my-3 text-paper-muted" strokeWidth={1.6} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
        <span className="text-paper-muted">DETECTED</span><span className="text-right">{time} IST</span>
        <span className="text-paper-muted">Δ ARRIVAL</span><span className="text-right">{delta}</span>
        <span className="text-paper-muted">PEAK BAND</span><span className="text-right">1.2–4.8 kHz</span>
        <span className="text-paper-muted">SNR</span><span className="text-right">{id === NODE_A ? "18.6 dB" : "14.1 dB"}</span>
        <span className="text-paper-muted">BATTERY / LINK</span><span className="text-right">{s.battery}% / {s.signal}%</span>
      </div>
    </div>
  );
}

function CorrelationResultModal({ onClose }: { onClose: () => void }) {
  const nav = useNavigate();
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm">
      <div className="anim-in w-[480px] border border-alert bg-panel glow-alert">
        <div className="flex items-center gap-3 bg-alert px-5 py-3 text-alert-foreground">
          <AlertTriangle size={20} /><h2 className="vk-title text-xl">Correlated Incident Alert</h2>
          <button aria-label="Close" onClick={onClose} className="ml-auto"><X size={16} /></button>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-4 p-5">
          <div className="space-y-2 text-sm">
            <Row k="Incident" v="DEMO-001" />
            <Row k="Confidence" v="Elevated after cross-verification" alert />
            <Row k="Status" v="Awaiting human verification" />
            <Row k="Reporting sensors" v="Sensor Node A, Sensor Node B" />
            <Row k="Timestamp" v="2026-10-10 20:14:36 IST" />
          </div>
          <Gauge value={RESULT} label="Correlation" tone="alert" />
        </div>
        <div className="flex gap-2 border-t border-border p-4">
          <VkButton variant="alert" size="sm" onClick={() => nav({ to: "/incident-area" })}>View Incident Area</VkButton>
          <VkButton variant="alertOutline" size="sm" onClick={() => nav({ to: "/overview" })}>Review Evidence</VkButton>
          <VkButton variant="ghost" size="sm" className="ml-auto" onClick={onClose}>Dismiss</VkButton>
        </div>
      </div>
    </div>
  );
}
function Row({ k, v, alert }: { k: string; v: string; alert?: boolean }) {
  return <div><div className="vk-label">{k}</div><div className={cn("font-medium", alert && "text-alert")}>{v}</div></div>;
}

function Correlation() {
  const vk = useVk();
  const nav = useNavigate();
  const [p, setP] = useState(vk.correlation === "done" ? 1 : 0);
  const [modal, setModal] = useState(false);
  const [compare, setCompare] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  useEffect(() => { if (vk.correlation === "idle") setP(0); }, [vk.correlation]);

  const run = () => {
    if (!vk.simulated) vk.runSimulation();
    vk.set({ correlation: "running", toastOpen: false });
    setP(0); setCompare(true);
    const start = Date.now();
    timer.current = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / 2600);
      setP(t);
      if (t >= 1) { if (timer.current) clearInterval(timer.current); vk.completeCorrelation(); setModal(true); }
    }, 40);
  };
  const running = vk.correlation === "running";
  const done = vk.correlation === "done";
  const offset = (1 - p) * 34;
  const conf = (RESULT * p).toFixed(1);

  return (
    <div className="vk-grid min-h-full p-6">
      <Crumbs items={["VANKAVACH", "Forest Map", "Signal Correlation"]} />
      <div className="mt-2 flex items-end justify-between">
        <div><h1 className="vk-title text-4xl">AI Signal Correlation</h1><p className="text-muted-foreground">Comparing independent sensor reports…</p></div>
        <div className="flex gap-2">
          <VkButton variant="ghost" onClick={() => nav({ to: "/" })}><ArrowLeft size={14} />Back to Map</VkButton>
          <VkButton onClick={() => { setCompare((c) => !c); toast(compare ? "Overlay hidden" : "Signals overlaid for comparison"); }}><GitCompare size={14} />Compare Signals</VkButton>
          <VkButton variant="primary" disabled={running} onClick={run}><Play size={14} />{done ? "Re-run Correlation" : running ? "Analysing…" : "Run Correlation"}</VkButton>
          <VkButton variant="ghost" disabled={!done} onClick={() => toast.success("Analysis exported", { description: "DEMO-001_correlation_report.pdf (simulated)" })}><Download size={14} />Export Analysis</VkButton>
        </div>
      </div>

      <div className="mt-6 flex items-stretch gap-4">
        <SensorCard id={NODE_A} wave={WA} time="20:14:36.180" delta="0.000 s (reference)" />
        <button onClick={run} disabled={running} aria-label="Run correlation" className="group flex flex-col items-center justify-center gap-2 px-2">
          <ChevronRight className="text-primary" size={18} />
          <span className={cn("grid h-14 w-14 place-items-center rounded-full border-2 border-primary text-primary group-hover:bg-primary/10", running && "anim-pulse")}><Play size={20} /></span>
          <ChevronRight className="text-primary" size={18} />
        </button>
        <SensorCard id={NODE_B} wave={WB} time="20:14:36.600" delta="+0.420 s" />
      </div>

      <div className="mt-6 vk-panel p-5">
        <div className="flex items-center justify-between">
          <div><h2 className="vk-title text-xl">Temporal &amp; Signal Similarity Analysis</h2>
            <p className="vk-label">{done ? "Analysis complete — deterministic mock result" : running ? "Aligning arrival times · cross-correlating spectra" : "Ready — press Run Correlation"}</p></div>
          <div className="flex items-center gap-6">
            <div className="text-right"><div className="vk-label">Correlation confidence</div><div className={cn("font-mono text-4xl", done ? "text-alert" : "text-primary")}>{conf}%</div></div>
            <div className="text-right"><div className="vk-label">Status</div><div className={cn("vk-title text-lg", done ? "text-alert" : "text-muted-foreground")}>{done ? "Match — cross-verified" : running ? "Comparing…" : "Ready"}</div></div>
          </div>
        </div>
        <div className="relative mt-4 h-56 overflow-hidden border border-border bg-background/60">
          <div className="absolute inset-x-0 top-6"><WaveformChart data={WA} height={80} tone="primary" className="text-muted-foreground" /></div>
          <div className="absolute inset-x-0 top-6 transition-opacity" style={{ opacity: compare || running || done ? 1 : 0.35 }}>
            <WaveformChart data={WB} height={80} tone="alert" offset={-offset} className="text-muted-foreground" />
          </div>
          <div className="absolute inset-x-0 bottom-4 px-4">
            <div className="flex justify-between vk-label"><span>Lag search window ±1.0 s</span><span>Best lag +0.42 s · Δ 0.03 s residual</span></div>
            <div className="mt-1 h-1.5 bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${p * 100}%` }} /></div>
          </div>
          <div className="absolute left-3 top-2 flex gap-4 vk-label"><span className="text-primary">— Node A</span><span className="text-alert">— Node B (shifted)</span></div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[["Temporal match", `${Math.round(92 * p)}%`], ["Spectral similarity", `${Math.round(84 * p)}%`], ["Geometric consistency", `${Math.round(81 * p)}%`], ["False-alarm likelihood", p ? `${Math.round(100 - 88 * p)}%` : "—"]].map(([k, v]) => (
            <div key={k} className="border border-border p-3"><div className="vk-label">{k}</div><div className="font-mono text-xl">{v}</div></div>
          ))}
        </div>
      </div>
      {modal && <CorrelationResultModal onClose={() => setModal(false)} />}
    </div>
  );
}

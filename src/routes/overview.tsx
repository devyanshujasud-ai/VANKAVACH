import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Network,
  MapPinned,
  Activity,
  AlertTriangle,
  Eye,
  Shield,
  FileText,
  BarChart3,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useVk } from "@/lib/vk-store";
import {
  SENSORS,
  INCIDENT,
  NODE_A,
  NODE_B,
  sensorById,
  ACTIVITY,
  LEAD,
  GRAPH_NODES,
  GRAPH_EDGES,
  type LogEvent,
} from "@/lib/vk-data";
import { INTEL_FEED } from "@/lib/vk-geo";
import { RelationshipGraph, CrossReferenceModal } from "@/components/vk/RelationshipGraph";
import { VkButton, Panel, Crumbs, Meta, SevBadge, Gauge } from "@/components/vk/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "Incident & Intel Overview | VANKAVACH" },
      {
        name: "description",
        content:
          "Side-by-side incident and intelligence overview with 14-day activity chart and relationship graph.",
      },
      { property: "og:title", content: "Incident & Intel Overview | VANKAVACH" },
      {
        property: "og:description",
        content:
          "Combined view of acoustic incident DEMO-001 and intelligence lead DEMO-017 with evidence connections.",
      },
    ],
  }),
  component: Overview,
});

/* ── Incident summary card ────────────────────────────────────────── */
function IncidentCard() {
  const vk = useVk();
  const nav = useNavigate();
  const a = sensorById(NODE_A);
  const b = sensorById(NODE_B);

  return (
    <div className="vk-panel overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border bg-alert/5 px-4 py-3">
        <AlertTriangle className="text-alert" size={18} />
        <div className="flex-1">
          <div className="vk-title text-xl text-alert">DEMO-001</div>
          <div className="vk-label">Correlated Acoustic Incident</div>
        </div>
        {vk.correlation === "done" && <Gauge value={87.4} label="Correlation" tone="alert" size={72} />}
      </header>
      <div className="space-y-1 p-4">
        <Meta k="Type" v="Acoustic — broadband transient" />
        <Meta k="First detected" v="2026-10-10 20:14:36 IST" />
        <Meta k="Reporting nodes" v={`${a.label} (${NODE_A}), ${b.label} (${NODE_B})`} />
        <Meta k="Location" v={`${INCIDENT.lat}, ${INCIDENT.lon}`} />
        <Meta k="Area estimate" v="≈ 0.38 km² (± 140 m)" />
        <Meta
          k="Correlation"
          v={vk.correlation === "done" ? "87.4% — Cross-verified" : "Pending"}
          tone={vk.correlation === "done" ? "alert" : undefined}
        />
        <Meta k="Verification" v="Awaiting human verification" tone="alert" />
      </div>
      <div className="flex gap-2 border-t border-border p-4">
        <VkButton size="sm" variant="alert" onClick={() => nav({ to: "/incident-area" })}>
          <MapPinned size={13} />
          View on Map
        </VkButton>
        <VkButton size="sm" variant="alertOutline" onClick={() => nav({ to: "/correlation" })}>
          <Activity size={13} />
          Signal Analysis
        </VkButton>
      </div>
    </div>
  );
}

/* ── Intel lead summary card ──────────────────────────────────────── */
function IntelCard() {
  const vk = useVk();
  const nav = useNavigate();
  const reviewed = vk.leadStatus === "REVIEWED";
  const submitted = vk.leadStatus === "SUBMITTED" || reviewed;

  return (
    <div className="vk-panel overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border bg-alert/5 px-4 py-3">
        <Network className="text-alert" size={18} />
        <div className="flex-1">
          <div className="vk-title text-xl text-alert">{LEAD.id}</div>
          <div className="vk-label">{LEAD.category}</div>
        </div>
        <Gauge value={LEAD.confidence} label="Confidence" tone="alert" size={72} />
      </header>
      <div className="space-y-1 p-4">
        <Meta k="Title" v={LEAD.title} />
        <Meta k="Source" v={LEAD.source} />
        <Meta k="Evidence" v={LEAD.evidence} />
        <Meta k="Received" v={LEAD.received} />
        <Meta
          k="Status"
          v={reviewed ? "REVIEWED" : submitted ? "SUBMITTED" : "UNVERIFIED"}
          tone={reviewed ? "primary" : "alert"}
        />
      </div>
      <div className="border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">{LEAD.summary}</p>
      </div>
      <div className="border-t border-border px-4 py-3">
        <div className="vk-label mb-2">Linked Records</div>
        <ul className="space-y-1">
          {LEAD.linked.map((l) => (
            <li key={l} className="flex items-center gap-2 text-xs">
              <FileText size={12} className="text-primary" />
              <span className="font-mono">{l}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2 border-t border-border p-4">
        <VkButton size="sm" variant="alert" onClick={() => nav({ to: "/intelligence" })}>
          <Eye size={13} />
          View Full Lead
        </VkButton>
        <VkButton
          size="sm"
          variant="alertOutline"
          disabled={submitted}
          onClick={() => vk.submitLead()}
        >
          Submit for Review
        </VkButton>
      </div>
    </div>
  );
}

/* ── 14-Day Activity Chart ────────────────────────────────────────── */
function ActivityChart() {
  return (
    <Panel title="14-Day Activity" right={<span className="vk-label"><BarChart3 size={11} className="inline" /> SYNTHETIC DATA</span>}>
      <div className="h-56 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ACTIVITY} barGap={1} barCategoryGap="20%">
            <XAxis
              dataKey="d"
              tick={{ fill: "oklch(0.66 0.025 160)", fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }}
              axisLine={{ stroke: "oklch(0.36 0.02 165)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "oklch(0.66 0.025 160)", fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.215 0.022 165)",
                border: "1px solid oklch(0.36 0.02 165)",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                borderRadius: 2,
              }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: "0.08em",
              }}
            />
            <Bar dataKey="acoustic" name="Acoustic" fill="oklch(0.78 0.16 70)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="intel" name="Intel" fill="oklch(0.76 0.11 168)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="reviewed" name="Reviewed" fill="oklch(0.36 0.02 165)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

/* ── Evidence popup component ─────────────────────────────────────── */
function EvidencePopup({ event, onClose }: { event: LogEvent; onClose: () => void }) {
  const sensor = sensorById(event.sensor);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div className="anim-in w-[420px] vk-panel p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="vk-title text-xl">Evidence Detail — {event.id}</h3>
          <button aria-label="Close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mt-3 space-y-1">
          <Meta k="Event ID" v={event.id} />
          <Meta k="Type" v={event.type} tone={event.type === "Acoustic" ? "alert" : undefined} />
          <Meta k="Sensor" v={`${sensor.label} (${event.sensor})`} />
          <Meta k="Time" v={`${event.time} IST`} />
          <Meta k="Severity" v={event.severity} tone={event.severity === "HIGH" ? "alert" : undefined} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{event.note}</p>
        <div className="mt-4 border-l-2 border-alert bg-alert/5 p-2 text-xs text-muted-foreground">
          This is a simulated event record. No field verification has been performed.
        </div>
        <div className="mt-4 flex justify-end">
          <VkButton size="sm" variant="ghost" onClick={onClose}>Dismiss</VkButton>
        </div>
      </div>
    </div>
  );
}

/* ── Main overview page ───────────────────────────────────────────── */
function Overview() {
  const vk = useVk();
  const nav = useNavigate();
  const [crossRef, setCrossRef] = useState(false);
  const [evidenceEvent, setEvidenceEvent] = useState<LogEvent | null>(null);

  const alertEvents = vk.events.filter((e) => e.severity !== "LOW");
  const online = SENSORS.filter((s) => s.status !== "offline").length;

  return (
    <div className="vk-grid min-h-full p-6">
      <Crumbs items={["VANKAVACH", "Monitoring", "Incident & Intel Overview"]} />
      <div className="mt-2 flex items-end justify-between">
        <div>
          <h1 className="vk-title text-4xl">Incident & Intel Overview</h1>
          <p className="text-muted-foreground">
            Combined view of active incidents and intelligence leads
          </p>
        </div>
        <div className="flex gap-2">
          <VkButton variant="ghost" onClick={() => nav({ to: "/" })}>
            <ArrowLeft size={14} />
            Back to Map
          </VkButton>
          <VkButton onClick={() => setCrossRef(true)}>
            <Network size={14} />
            Cross-Reference Graph
          </VkButton>
          <VkButton variant="ghost" onClick={() => vk.set({ reviewOpen: true })}>
            <Shield size={14} />
            Review Queue ({vk.review.filter((r) => r.status !== "REVIEWED").length})
          </VkButton>
        </div>
      </div>

      {/* Summary stats row */}
      <div className="mt-6 grid grid-cols-6 gap-2">
        {[
          ["Sensors Online", `${online}/${SENSORS.length}`, "primary"],
          ["Active Alerts", `${alertEvents.length}`, "alert"],
          ["Total Events", `${vk.events.length}`, "primary"],
          ["Intel Items", `${INTEL_FEED.length}`, "primary"],
          ["Pending Reviews", `${vk.review.filter((r) => r.status !== "REVIEWED").length}`, "alert"],
          ["Correlation", vk.correlation === "done" ? "87.4%" : "Pending", vk.correlation === "done" ? "alert" : "primary"],
        ].map(([k, v, tone]) => (
          <div key={k} className="vk-panel p-3">
            <div className="vk-label text-[9px]">{k}</div>
            <div className={cn("font-mono text-lg", tone === "alert" ? "text-alert" : "text-primary")}>{v}</div>
          </div>
        ))}
      </div>

      {/* Side-by-side incident + intel cards */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <IncidentCard />
        <IntelCard />
      </div>

      {/* Activity chart + relationship graph */}
      <div className="mt-4 grid grid-cols-[1fr_1fr] gap-4">
        <ActivityChart />
        <Panel title="Relationship Graph" className="h-[340px]">
          <RelationshipGraph filter="all" compact onSelect={() => {}} />
        </Panel>
      </div>

      {/* Recent event log with evidence popups */}
      <div className="mt-4">
        <Panel
          title="Recent Events"
          right={
            <span className="font-mono text-[10px] text-alert">
              {alertEvents.length} ALERTS
            </span>
          }
        >
          <ul className="max-h-56 overflow-auto">
            {vk.events.slice(0, 8).map((e) => {
              const sensor = sensorById(e.sensor);
              return (
                <li key={e.id}>
                  <button
                    onClick={() => setEvidenceEvent(e)}
                    className={cn(
                      "grid w-full grid-cols-[58px_1fr_auto] items-center gap-2 border-b border-border/40 px-3 py-2 text-left hover:bg-accent",
                      e.sim && "anim-in",
                    )}
                  >
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {e.time}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-xs",
                          e.type === "Acoustic" && "text-alert",
                        )}
                      >
                        {e.type} · {sensor.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {e.sensor} · {e.id}
                      </span>
                    </span>
                    <SevBadge s={e.severity} />
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Footer disclaimer */}
      <div className="mt-4 vk-panel border-l-2 border-alert bg-alert/5 p-3 text-xs text-muted-foreground">
        <strong className="text-alert">SIMULATION DATA</strong> — All incidents, intelligence
        leads, and relationships displayed on this page are synthetic data created for demonstration
        and training purposes. No verified allegations are represented.
      </div>

      {crossRef && <CrossReferenceModal onClose={() => setCrossRef(false)} />}
      {evidenceEvent && (
        <EvidencePopup event={evidenceEvent} onClose={() => setEvidenceEvent(null)} />
      )}
    </div>
  );
}

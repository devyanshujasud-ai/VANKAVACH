import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { X, ArrowLeft, FileText, Map, Layers } from "lucide-react";
import { useVk } from "@/lib/vk-store";
import { SENSORS, INCIDENT, NODE_A, NODE_B, sensorById } from "@/lib/vk-data";
import { TerrainMap, SensorMarker, toPct, type View } from "@/components/vk/TerrainMap";
import { TadobaMap } from "@/components/vk/TadobaMap";
import { INCIDENT_GEO, sensorGeoById } from "@/lib/vk-geo";
import { VkButton, Crumbs, Meta } from "@/components/vk/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/incident-area")({
  head: () => ({
    meta: [
      { title: "Incident Location Analysis | VANKAVACH" },
      { name: "description", content: "Triangulated estimated incident area from correlated sensor reports (simulated)." },
      { property: "og:title", content: "Incident Location Analysis | VANKAVACH" },
      { property: "og:description", content: "Simulated triangulation map for incident DEMO-001." },
    ],
  }),
  component: IncidentArea,
});

const POLY = ([[-46, -22], [-18, -44], [24, -38], [52, -12], [44, 24], [12, 42], [-28, 34], [-54, 8]] as [number, number][]).map(([dx, dy]) => `${INCIDENT.x + dx},${INCIDENT.y + dy}`).join(" ");
const START: View = { k: 2, cx: INCIDENT.x, cy: INCIDENT.y };
const NEAR = ["S-02", "S-03", "S-05", "S-08", "S-09"];

function IncidentDetailsDrawer({ onClose }: { onClose: () => void }) {
  const vk = useVk();
  const nav = useNavigate();
  return (
    <aside className="anim-in absolute right-0 top-0 z-30 flex h-full w-[360px] flex-col border-l border-alert/40 bg-panel shadow-2xl">
      <header className="flex items-center justify-between border-b border-border p-4">
        <div><div className="vk-label">Incident record</div><h2 className="vk-title text-xl text-alert">DEMO-001</h2></div>
        <button aria-label="Close incident details" onClick={onClose}><X size={16} /></button>
      </header>
      <div className="flex-1 space-y-1 overflow-auto p-4">
        <Meta k="Reporting nodes" v="Sensor Node A (S-04), Sensor Node B (S-07)" />
        <Meta k="Detection type" v="Acoustic — broadband transient" />
        <Meta k="First detected" v="2026-10-10 20:14:36 IST" />
        <Meta k="Correlation confidence" v={vk.correlation === "done" ? "87.4%" : "Pending correlation"} tone="alert" />
        <Meta k="Estimated location" v={`${INCIDENT.lat}, ${INCIDENT.lon}`} />
        <Meta k="Area estimate" v="≈ 0.38 km² (± 140 m)" />
        <Meta k="Verification status" v="Awaiting human verification" tone="alert" />
        <p className="pt-3 text-xs text-muted-foreground">Simulated record for training. Location confidence is under assessment; no field team has confirmed this event.</p>
      </div>
      <div className="border-t border-border p-4"><VkButton variant="alert" className="w-full" onClick={() => nav({ to: "/overview" })}><FileText size={14} />View Incident Details</VkButton></div>
    </aside>
  );
}

function IncidentArea() {
  const vk = useVk();
  const nav = useNavigate();
  const [view, setView] = useState<View>(START);
  const [drawer, setDrawer] = useState(false);
  const [mapMode, setMapMode] = useState<"leaflet" | "terrain">("leaflet");
  const a = sensorById(NODE_A), b = sensorById(NODE_B);

  const sharedOverlay = (
    <>
      <div className="absolute left-5 top-5 z-20" style={{ zIndex: 1001 }}>
        <Crumbs items={["VANKAVACH", "Correlation", "Incident Location"]} />
        <h1 className="vk-title mt-1 text-3xl">Incident Location Analysis</h1>
        <p className="text-sm text-muted-foreground">Correlated reports: 2 sensor nodes · Triangulated zone</p>
        <div className="mt-2 flex items-center gap-2">
          <VkButton size="sm" variant="ghost" onClick={() => nav({ to: "/correlation" })}>
            <ArrowLeft size={13} />Back to Correlation
          </VkButton>
          <div className="flex gap-1">
            <button
              onClick={() => setMapMode("leaflet")}
              className={cn("px-2 py-1 font-mono text-[10px] border", mapMode === "leaflet" ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground bg-panel")}
            >
              <Map size={11} className="inline mr-1" />REAL MAP
            </button>
            <button
              onClick={() => setMapMode("terrain")}
              className={cn("px-2 py-1 font-mono text-[10px] border", mapMode === "terrain" ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground bg-panel")}
            >
              <Layers size={11} className="inline mr-1" />TERRAIN
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 z-20 border-l-2 border-alert bg-panel/95 p-4 shadow-xl" style={{ zIndex: 1001 }}>
        <div className="vk-title text-lg text-alert">Estimated Incident Area</div>
        <div className="text-xs text-muted-foreground">Location confidence: Under assessment (±140m)</div>
        <div className="font-mono text-xs text-primary mt-1">Geo: {INCIDENT_GEO[0].toFixed(4)}°N, {INCIDENT_GEO[1].toFixed(4)}°E</div>
        <VkButton size="sm" variant="alertOutline" className="mt-2" onClick={() => setDrawer(true)}>Open Incident Details</VkButton>
      </div>

      {mapMode === "terrain" && !drawer && (
        <button onClick={() => setDrawer(true)} className="absolute z-10 -translate-x-1/2 translate-y-5 bg-alert px-2 py-0.5 font-mono text-[10px] text-alert-foreground" style={toPct(view, INCIDENT.x, INCIDENT.y)}>DEMO-001 · DETAILS</button>
      )}

      {!vk.simulated && (
        <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 vk-panel px-3 py-1.5 text-xs text-muted-foreground" style={{ zIndex: 1001 }}>
          Showing baseline scenario — run the simulation from the dashboard for live context.
        </div>
      )}

      {drawer && <IncidentDetailsDrawer onClose={() => setDrawer(false)} />}
    </>
  );

  return (
    <div className="relative h-full min-h-[700px]">
      {mapMode === "leaflet" ? (
        <TadobaMap
          className="absolute inset-0 h-full w-full"
          showIncident={true}
          showTriangulation={true}
          showSensors={true}
          showBoundaries={true}
          showGates={true}
          showWater={true}
          flyTo={INCIDENT_GEO}
          flyZoom={14}
          sensorStatus={(id) => (id === NODE_A || id === NODE_B ? "alert" : sensorById(id).status)}
          overlay={sharedOverlay}
        />
      ) : (
        <TerrainMap view={view} setView={setView} className="absolute inset-0" overlay={sharedOverlay}>
          {NEAR.map((id) => { const s = sensorById(id); return <line key={id} x1={s.x} y1={s.y} x2={INCIDENT.x} y2={INCIDENT.y} className="stroke-primary" strokeOpacity="0.3" strokeWidth="0.8" />; })}
          <polygon points={POLY} className="fill-alert/20 stroke-alert" strokeWidth="1.2" />
          {[a, b].map((s) => (
            <g key={s.id}>
              <line x1={s.x} y1={s.y} x2={INCIDENT.x} y2={INCIDENT.y} className="stroke-alert anim-dash" strokeWidth="1.4" strokeDasharray="5 4" />
              <circle cx={s.x} cy={s.y} r={Math.hypot(s.x - INCIDENT.x, s.y - INCIDENT.y)} className="fill-none stroke-alert" strokeOpacity="0.25" strokeDasharray="2 4" />
            </g>
          ))}
          {SENSORS.map((s) => <SensorMarker key={s.id} x={s.x} y={s.y} k={view.k} status={s.id === NODE_A || s.id === NODE_B ? "alert" : s.status} label={s.id === NODE_A ? "NODE A" : s.id === NODE_B ? "NODE B" : s.id} onClick={() => setView({ k: view.k, cx: s.x, cy: s.y })} />)}
          <g transform={`translate(${INCIDENT.x} ${INCIDENT.y})`} className="cursor-pointer" onClick={() => setDrawer(true)} role="button" aria-label="Incident marker">
            <circle r="16" className="fill-none stroke-alert anim-ring" />
            <circle r="9" className="fill-alert/30 stroke-alert" />
            <path d="M-5 0H5M0 -5V5" className="stroke-alert-foreground" strokeWidth="2" />
            <circle r="3" className="fill-alert" />
          </g>
        </TerrainMap>
      )}
    </div>
  );
}

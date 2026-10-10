import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { AlertTriangle, Battery, Wifi, X, Play, Eye, Radio, Maximize2, Minimize2, Filter, Activity, Map, Layers } from "lucide-react";
import { useVk } from "@/lib/vk-store";
import { SENSORS, LINKS, INCIDENT, INCIDENT_TYPES, NODE_A, NODE_B, sensorById, genWave, signalSeries, type Severity } from "@/lib/vk-data";
import { TerrainMap, SensorMarker, toPct, HOME, type View } from "@/components/vk/TerrainMap";
import { TadobaMap } from "@/components/vk/TadobaMap";
import { sensorGeoById, INCIDENT_GEO } from "@/lib/vk-geo";
import { WaveformChart } from "@/components/vk/Waveform";
import { Panel, VkButton, SevBadge, Meta, Crumbs } from "@/components/vk/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Forest Monitoring Dashboard | VANKAVACH" },
      { name: "description", content: "Live (simulated) acoustic sensor map, event log and alerts for forest monitoring." },
      { property: "og:title", content: "Forest Monitoring Dashboard | VANKAVACH" },
      { property: "og:description", content: "Simulated forest-surveillance dashboard with sensors, alerts and waveforms." },
    ],
  }),
  component: Dashboard,
});

function NotificationToast({ onView, onClose }: { onView: () => void; onClose: () => void }) {
  return (
    <div className="anim-in absolute right-4 top-4 z-20 w-80 border border-alert bg-panel glow-alert">
      <div className="flex items-start gap-3 bg-alert/10 p-3">
        <AlertTriangle className="mt-0.5 text-alert anim-pulse" size={20} />
        <div className="flex-1">
          <div className="vk-title text-base text-alert">Acoustic Event Detected</div>
          <div className="text-xs text-muted-foreground">Potential forest disturbance detected</div>
          <div className="mt-2 flex items-center gap-2"><SevBadge s="HIGH" /><span className="font-mono text-[10px] text-muted-foreground">20:14:36 IST · S-04 / S-07</span></div>
          <VkButton variant="alert" size="sm" className="mt-3" onClick={onView}><Eye size={13} />View Incident</VkButton>
        </div>
        <button aria-label="Dismiss alert" onClick={onClose}><X size={14} /></button>
      </div>
    </div>
  );
}

function Dashboard() {
  const vk = useVk();
  const nav = useNavigate();
  const [view, setView] = useState<View>(HOME);
  const [sev, setSev] = useState<Severity | "ALL">("ALL");
  const [type, setType] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [mapMode, setMapMode] = useState<"terrain" | "leaflet">("leaflet");

  useEffect(() => {
    if (vk.simulated) { setView({ k: 1.9, cx: INCIDENT.x, cy: INCIDENT.y }); setSelectedEvent((e) => e ?? "EV-2042"); }
    else { setView(HOME); setSelectedEvent(null); }
  }, [vk.simulated]);

  const q = vk.query.toLowerCase();
  const events = useMemo(() => vk.events.filter((e) =>
    (sev === "ALL" || e.severity === sev) && (!type || e.type === type) &&
    (!q || `${e.id} ${e.type} ${e.sensor} ${e.note} ${sensorById(e.sensor).name}`.toLowerCase().includes(q))), [vk.events, sev, type, q]);
  const sensors = SENSORS.filter((s) => !q || `${s.id} ${s.name} ${s.label} ${s.zone}`.toLowerCase().includes(q));
  const alerts = vk.events.filter((e) => e.severity !== "LOW").filter((e) => !q || `${e.id} ${e.type} ${e.sensor}`.toLowerCase().includes(q));
  const status = (id: string) => (vk.simulated && (id === NODE_A || id === NODE_B) ? "alert" : sensorById(id).status);
  const sel = vk.selectedSensor ? sensorById(vk.selectedSensor) : null;
  const ev = vk.events.find((e) => e.id === selectedEvent) ?? vk.events[0]!;
  const evSensor = sensorById(ev.sensor);
  const online = SENSORS.filter((s) => s.status !== "offline").length;

  const focusSensor = (id: string) => { const s = sensorById(id); vk.set({ selectedSensor: id }); setView({ k: Math.max(view.k, 1.7), cx: s.x, cy: s.y }); };
  const viewIncident = () => { if (!vk.simulated) vk.runSimulation(); vk.set({ toastOpen: false, selectedSensor: NODE_A }); setSelectedEvent("EV-2042"); setView({ k: 2.2, cx: INCIDENT.x, cy: INCIDENT.y }); };
  const typeCounts = INCIDENT_TYPES.map((t) => ({ ...t, count: vk.events.filter((e) => e.type === t.key).length }));

  return (
    <div className="grid h-full min-h-[760px] grid-cols-[290px_1fr_330px] grid-rows-[1fr_auto] gap-2 p-2">
      {/* LEFT */}
      <div className="row-span-1 flex min-h-0 flex-col gap-2 overflow-auto">
        <Panel title="Incident Alerts" right={<span className="font-mono text-[10px] text-alert">{alerts.length} ACTIVE</span>}>
          <div className="flex items-center gap-1 border-b border-border p-2">
            <Filter size={12} className="text-muted-foreground" />
            {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((s) => (
              <button key={s} onClick={() => setSev(s)} className={cn("px-2 py-0.5 font-mono text-[10px] border", sev === s ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground")}>{s}</button>
            ))}
          </div>
          <ul className="max-h-48 overflow-auto">
            {alerts.length === 0 && <li className="p-3 text-xs text-muted-foreground">No alerts match.</li>}
            {alerts.map((a) => (
              <li key={a.id}>
                <button onClick={() => { setSelectedEvent(a.id); focusSensor(a.sensor); }} className={cn("flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left hover:bg-accent", a.severity === "HIGH" ? "border-alert" : "border-alert/40", selectedEvent === a.id && "bg-accent")}>
                  <AlertTriangle size={13} className={a.severity === "HIGH" ? "text-alert" : "text-muted-foreground"} />
                  <div className="min-w-0 flex-1"><div className="truncate text-xs">{a.type} · {sensorById(a.sensor).name}</div><div className="font-mono text-[10px] text-muted-foreground">{a.id} · {a.time}</div></div>
                  <SevBadge s={a.severity} />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Sensor Nodes" right={<span className="font-mono text-[10px]"><span className="text-primary">{online} ON</span> · <span className="text-muted-foreground">{SENSORS.length - online} OFF</span></span>}>
          <ul className="max-h-56 overflow-auto">
            {sensors.length === 0 && <li className="p-3 text-xs text-muted-foreground">No sensors match “{vk.query}”.</li>}
            {sensors.map((s) => {
              const st = status(s.id);
              return (
                <li key={s.id}><button onClick={() => focusSensor(s.id)} className={cn("flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-accent", vk.selectedSensor === s.id && "bg-primary/10")}>
                  <span className={cn("h-2 w-2 rounded-full", st === "alert" ? "bg-alert anim-pulse" : st === "offline" ? "bg-muted-foreground" : "bg-primary")} />
                  <span className="font-mono text-[10px] text-muted-foreground">{s.id}</span><span className="flex-1 truncate">{s.label === `Sensor Node ${s.id.slice(2)}` ? s.name : `${s.label} · ${s.name}`}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{s.battery}%</span>
                </button></li>
              );
            })}
          </ul>
        </Panel>
        <Panel title="Incident Types">
          <div className="p-2">
            {typeCounts.map((t) => (
              <button key={t.key} onClick={() => setType(type === t.key ? null : t.key)} className={cn("flex w-full items-center justify-between px-2 py-1.5 text-xs hover:bg-accent", type === t.key && "bg-primary/10 text-primary")}>
                <span>{t.label}</span><span className={cn("font-mono", t.key === "Acoustic" && t.count > 0 && "text-alert")}>{t.count}</span>
              </button>
            ))}
          </div>
        </Panel>
        <div className="grid grid-cols-3 gap-2">
          {[["Coverage", "86%"], ["Uptime", "99.1%"], ["Latency", "1.4s"]].map(([k, v]) => (
            <div key={k} className="vk-panel p-2"><div className="vk-label text-[9px]">{k}</div><div className="font-mono text-sm text-primary">{v}</div></div>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <VkButton variant="primary" onClick={() => { vk.runSimulation(); setSelectedEvent("EV-2042"); }}><Play size={14} />Run Simulation</VkButton>
          <VkButton variant="alertOutline" disabled={!vk.simulated} onClick={viewIncident}><Eye size={14} />View Incident</VkButton>
        </div>
      </div>

      {/* MAP */}
      <div className="relative min-h-0 vk-panel overflow-hidden">
        <div className="absolute left-3 top-3 z-10 vk-panel bg-panel/95 backdrop-blur-md p-3 border border-border/80 shadow-2xl max-w-sm rounded-sm" style={{ zIndex: 1001 }}>
          <Crumbs items={["VANKAVACH", "Monitoring", "Forest Map"]} />
          <div className="vk-title mt-1 text-lg text-foreground font-bold">Forest Monitoring Dashboard</div>
          <div className="vk-label text-[10px] text-muted-foreground">{mapMode === "leaflet" ? "Tadoba-Andhari Tiger Reserve · Real geographic tiles" : "Tadoba-like fictional reserve · Grid 21°N 79°E"}</div>
          <div className="mt-2.5 flex gap-1">
            <button onClick={() => setMapMode("leaflet")} className={cn("px-2.5 py-1 font-mono text-[10px] border rounded-sm transition-colors", mapMode === "leaflet" ? "border-primary text-primary bg-primary/15 font-semibold" : "border-border text-muted-foreground bg-panel hover:text-foreground")}>
              <Map size={11} className="inline mr-1" />REAL MAP
            </button>
            <button onClick={() => setMapMode("terrain")} className={cn("px-2.5 py-1 font-mono text-[10px] border rounded-sm transition-colors", mapMode === "terrain" ? "border-primary text-primary bg-primary/15 font-semibold" : "border-border text-muted-foreground bg-panel hover:text-foreground")}>
              <Layers size={11} className="inline mr-1" />TERRAIN
            </button>
          </div>
        </div>
        {vk.simulated && vk.toastOpen && <NotificationToast onView={viewIncident} onClose={() => vk.set({ toastOpen: false })} />}

        {mapMode === "leaflet" ? (
          <TadobaMap
            className="h-full"
            sensorStatus={(id) => status(id)}
            selectedSensor={vk.selectedSensor}
            onSensorClick={(id) => focusSensor(id)}
            showIncident={vk.simulated}
            showSensors={true}
            showBoundaries={true}
            showGates={true}
            showWater={true}
            flyTo={vk.selectedSensor ? sensorGeoById(vk.selectedSensor)?.position ?? null : vk.simulated ? INCIDENT_GEO : null}
            flyZoom={vk.selectedSensor ? 14 : vk.simulated ? 13 : undefined}
            overlay={
              sel && mapMode === "leaflet" ? (
                <div className="anim-in absolute z-10 w-64 vk-panel p-3 shadow-2xl" style={{ top: 80, right: 60, zIndex: 1001 }}>
                  <div className="flex items-center justify-between"><span className="vk-title text-sm">{sel.label}</span><button aria-label="Close sensor card" onClick={() => vk.set({ selectedSensor: null })}><X size={13} /></button></div>
                  <div className="vk-label">{sel.id} · {sel.name} · {sel.type}</div>
                  <WaveformChart data={genWave(sel.seed, 120, status(sel.id) === "alert" ? (sel.id === NODE_A ? 60 : 68) : null)} tone={status(sel.id) === "alert" ? "alert" : "primary"} height={44} className="my-2 text-muted-foreground" />
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn("font-mono", status(sel.id) === "alert" ? "text-alert" : status(sel.id) === "offline" ? "text-muted-foreground" : "text-primary")}>● {status(sel.id).toUpperCase()}</span>
                    <span className="flex items-center gap-1 font-mono"><Battery size={12} />{sel.battery}%</span>
                    <span className="flex items-center gap-1 font-mono"><Wifi size={12} />{sel.signal ? `${sel.signal}%` : "—"}</span>
                  </div>
                  {vk.simulated && (sel.id === NODE_A || sel.id === NODE_B) && (
                    <div className="mt-2 flex gap-1">
                      <VkButton size="sm" variant="ghost" onClick={() => focusSensor(sel.id === NODE_A ? NODE_B : NODE_A)}>Open {sel.id === NODE_A ? "Node B" : "Node A"}</VkButton>
                      <VkButton size="sm" variant="alert" className="ml-auto" onClick={() => nav({ to: "/correlation" })}><Activity size={12} />Analyze Signals</VkButton>
                    </div>
                  )}
                </div>
              ) : undefined
            }
          />
        ) : (
          <TerrainMap view={view} setView={setView} className="h-full"
            overlay={sel && (
              <div className="anim-in absolute z-10 w-64 -translate-x-1/2 translate-y-6 vk-panel p-3 shadow-2xl" style={toPct(view, sel.x, sel.y)}>
                <div className="flex items-center justify-between"><span className="vk-title text-sm">{sel.label}</span><button aria-label="Close sensor card" onClick={() => vk.set({ selectedSensor: null })}><X size={13} /></button></div>
                <div className="vk-label">{sel.id} · {sel.name} · {sel.type}</div>
                <WaveformChart data={genWave(sel.seed, 120, status(sel.id) === "alert" ? (sel.id === NODE_A ? 60 : 68) : null)} tone={status(sel.id) === "alert" ? "alert" : "primary"} height={44} className="my-2 text-muted-foreground" />
                <div className="flex items-center justify-between text-xs">
                  <span className={cn("font-mono", status(sel.id) === "alert" ? "text-alert" : status(sel.id) === "offline" ? "text-muted-foreground" : "text-primary")}>● {status(sel.id).toUpperCase()}</span>
                  <span className="flex items-center gap-1 font-mono"><Battery size={12} />{sel.battery}%</span>
                  <span className="flex items-center gap-1 font-mono"><Wifi size={12} />{sel.signal ? `${sel.signal}%` : "—"}</span>
                </div>
                {vk.simulated && (sel.id === NODE_A || sel.id === NODE_B) && (
                  <div className="mt-2 flex gap-1">
                    <VkButton size="sm" variant="ghost" onClick={() => focusSensor(sel.id === NODE_A ? NODE_B : NODE_A)}>Open {sel.id === NODE_A ? "Node B" : "Node A"}</VkButton>
                    <VkButton size="sm" variant="alert" className="ml-auto" onClick={() => nav({ to: "/correlation" })}><Activity size={12} />Analyze Signals</VkButton>
                  </div>
                )}
              </div>
            )}>
            {LINKS.map(([a, b]) => { const A = sensorById(a), B = sensorById(b); const hot = vk.simulated && ((a === NODE_A && b === NODE_B)); return (
              <line key={a + b} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={cn(hot ? "stroke-alert anim-dash" : "stroke-primary")} strokeOpacity={hot ? 0.9 : 0.35} strokeWidth={hot ? 1.5 : 1} strokeDasharray="3 5" />
            ); })}
            {vk.simulated && (
              <g transform={`translate(${INCIDENT.x} ${INCIDENT.y})`}>
                {[0, 0.8, 1.6].map((d) => <circle key={d} r="18" className="fill-alert/10 stroke-alert anim-ring" strokeWidth="1.2" style={{ animationDelay: `${d}s` }} />)}
                <circle r="4" className="fill-alert" />
              </g>
            )}
            {SENSORS.map((s) => <SensorMarker key={s.id} x={s.x} y={s.y} k={view.k} status={status(s.id)} selected={vk.selectedSensor === s.id} label={s.id === NODE_A ? "NODE A" : s.id === NODE_B ? "NODE B" : s.id} onClick={() => focusSensor(s.id)} />)}
          </TerrainMap>
        )}
      </div>

      {/* RIGHT */}
      {panelOpen ? (
        <div className={cn("flex min-h-0 flex-col gap-2", panelExpanded && "fixed inset-y-16 right-2 z-30 w-[520px]")}>
          <Panel title="Event Log" className="min-h-0 flex-1" right={<div className="flex gap-1 text-muted-foreground">
            <button aria-label={panelExpanded ? "Collapse panel" : "Expand panel"} onClick={() => setPanelExpanded((x) => !x)}>{panelExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}</button>
            <button aria-label="Close panel" onClick={() => setPanelOpen(false)}><X size={13} /></button></div>}>
            <ul className="min-h-0 flex-1 overflow-auto">
              {events.length === 0 && <li className="p-3 text-xs text-muted-foreground">No events match filters.</li>}
              {events.map((e) => (
                <li key={e.id}><button onClick={() => { setSelectedEvent(e.id); focusSensor(e.sensor); }} className={cn("grid w-full grid-cols-[58px_1fr_auto] items-center gap-2 border-b border-border/50 px-3 py-2 text-left hover:bg-accent", ev.id === e.id && "bg-accent", e.sim && "anim-in")}>
                  <span className="font-mono text-[10px] text-muted-foreground">{e.time}</span>
                  <span className="min-w-0"><span className={cn("block truncate text-xs", e.type === "Acoustic" && "text-alert")}>{e.type}</span><span className="font-mono text-[10px] text-muted-foreground">{e.sensor} · {e.id}</span></span>
                  <SevBadge s={e.severity} />
                </button></li>
              ))}
            </ul>
          </Panel>
          <Panel title={`Event ${ev.id}`}>
            <div className="p-3">
              <p className="text-xs text-muted-foreground">{ev.note}</p>
              <WaveformChart data={genWave(evSensor.seed, 140, ev.type === "Acoustic" ? 70 : null)} tone={ev.type === "Acoustic" ? "alert" : "primary"} height={56} className="my-2 text-muted-foreground" />
              <Meta k="Source" v={`${evSensor.label} (${ev.sensor})`} />
              <Meta k="Timestamp" v={`${ev.time} IST`} />
              <Meta k="Severity" v={ev.severity} tone={ev.severity === "HIGH" ? "alert" : undefined} />
            </div>
          </Panel>
          <Panel title="Signal Strength · 24 min">
            <div className="h-28 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signalSeries(evSensor.seed, ev.type === "Acoustic")}>
                  <XAxis dataKey="t" hide /><YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "var(--panel)", border: "1px solid var(--border)", fontSize: 11 }} />
                  <Area type="monotone" dataKey="v" stroke={ev.type === "Acoustic" ? "var(--alert)" : "var(--primary)"} fill={ev.type === "Acoustic" ? "var(--alert)" : "var(--primary)"} fillOpacity={0.15} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      ) : (
        <button onClick={() => setPanelOpen(true)} className="vk-panel vk-label grid place-items-center hover:text-primary">Show event panel</button>
      )}

      {/* BOTTOM STRIP */}
      <div className="col-span-3 flex items-center gap-6 vk-panel px-4 py-2">
        <div className="flex items-center gap-2"><Radio size={14} className="text-primary" /><span className="vk-label">Sensors</span><span className="font-mono text-xs">{online}/{SENSORS.length} online</span></div>
        <div className="flex items-center gap-2"><span className="vk-label">Incident</span><span className={cn("font-mono text-xs", vk.simulated ? "text-alert" : "text-muted-foreground")}>{vk.simulated ? "DEMO-001 · Acoustic · 2 nodes reporting" : "None active"}</span></div>
        <div className="flex items-center gap-2"><span className="vk-label">Location</span><span className="font-mono text-xs">{INCIDENT.lat}, {INCIDENT.lon}</span></div>
        <div className="ml-auto flex gap-2">
          <VkButton size="sm" variant="ghost" onClick={() => setView(HOME)}>Recenter</VkButton>
          <VkButton size="sm" variant="alert" disabled={!vk.simulated} onClick={() => nav({ to: "/correlation" })}><Activity size={12} />Analyze Signals</VkButton>
        </div>
      </div>
    </div>
  );
}

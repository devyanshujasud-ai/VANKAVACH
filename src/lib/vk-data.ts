// All records are SIMULATED / FICTIONAL. No real people, places or allegations.
export type SensorStatus = "online" | "offline" | "alert";
export type Sensor = {
  id: string; name: string; label: string; x: number; y: number;
  status: SensorStatus; battery: number; signal: number; zone: string; type: string; seed: number;
};

export const MAP_W = 1000;
export const MAP_H = 640;
export const INCIDENT = { x: 588, y: 338, lat: "21.4782° N", lon: "79.3361° E" };

export const SENSORS: Sensor[] = [
  { id: "S-01", name: "Ridge North", label: "Sensor Node 01", x: 180, y: 150, status: "online", battery: 91, signal: 78, zone: "Zone N1", type: "Acoustic", seed: 11 },
  { id: "S-02", name: "Teak Belt", label: "Sensor Node 02", x: 330, y: 110, status: "online", battery: 84, signal: 72, zone: "Zone N2", type: "Acoustic", seed: 12 },
  { id: "S-03", name: "Riverbend", label: "Sensor Node 03", x: 260, y: 330, status: "online", battery: 67, signal: 64, zone: "Zone W1", type: "Acoustic + PIR", seed: 13 },
  { id: "S-04", name: "Bamboo Hollow", label: "Sensor Node A", x: 520, y: 300, status: "online", battery: 82, signal: 88, zone: "Zone C2", type: "Acoustic", seed: 14 },
  { id: "S-05", name: "Salt Lick", label: "Sensor Node 05", x: 760, y: 160, status: "online", battery: 76, signal: 70, zone: "Zone E1", type: "Camera trap", seed: 15 },
  { id: "S-06", name: "Eastern Gate", label: "Sensor Node 06", x: 880, y: 300, status: "offline", battery: 9, signal: 0, zone: "Zone E2", type: "Acoustic", seed: 16 },
  { id: "S-07", name: "Sal Grove", label: "Sensor Node B", x: 650, y: 400, status: "online", battery: 74, signal: 81, zone: "Zone C3", type: "Acoustic", seed: 17 },
  { id: "S-08", name: "Waterhole", label: "Sensor Node 08", x: 420, y: 500, status: "online", battery: 58, signal: 61, zone: "Zone S1", type: "Acoustic + PIR", seed: 18 },
  { id: "S-09", name: "Southern Track", label: "Sensor Node 09", x: 780, y: 540, status: "online", battery: 88, signal: 69, zone: "Zone S2", type: "Seismic", seed: 19 },
  { id: "S-10", name: "Watchtower 3", label: "Sensor Node 10", x: 120, y: 480, status: "offline", battery: 0, signal: 0, zone: "Zone W2", type: "Relay", seed: 20 },
];
export const NODE_A = "S-04";
export const NODE_B = "S-07";
export const LINKS: [string, string][] = [
  ["S-01", "S-02"], ["S-02", "S-04"], ["S-01", "S-03"], ["S-03", "S-04"], ["S-04", "S-07"],
  ["S-04", "S-05"], ["S-05", "S-06"], ["S-07", "S-09"], ["S-07", "S-08"], ["S-08", "S-03"], ["S-03", "S-10"], ["S-06", "S-07"],
];
export const sensorById = (id: string) => SENSORS.find((s) => s.id === id)!;

export const INCIDENT_TYPES = [
  { key: "Acoustic", label: "Acoustic disturbance", count: 0 },
  { key: "Vehicle", label: "Vehicle movement", count: 2 },
  { key: "Motion", label: "Motion / PIR trigger", count: 5 },
  { key: "Thermal", label: "Thermal anomaly", count: 1 },
];

export type Severity = "LOW" | "MEDIUM" | "HIGH";
export type LogEvent = { id: string; time: string; type: string; sensor: string; severity: Severity; note: string; sim?: boolean };

export const BASE_EVENTS: LogEvent[] = [
  { id: "EV-2041", time: "19:52:08", type: "Motion", sensor: "S-08", severity: "LOW", note: "PIR trigger — likely ungulate (simulated)." },
  { id: "EV-2040", time: "19:31:44", type: "Vehicle", sensor: "S-09", severity: "MEDIUM", note: "Low-frequency engine signature on patrol track." },
  { id: "EV-2039", time: "19:10:02", type: "Heartbeat", sensor: "S-06", severity: "MEDIUM", note: "Node unreachable — battery critical." },
  { id: "EV-2038", time: "18:47:19", type: "Motion", sensor: "S-03", severity: "LOW", note: "Camera trap motion burst (3 frames)." },
  { id: "EV-2037", time: "18:20:55", type: "Thermal", sensor: "S-05", severity: "LOW", note: "Thermal blob consistent with wildlife." },
];
export const SIM_EVENTS: LogEvent[] = [
  { id: "EV-2043", time: "20:14:37", type: "Acoustic", sensor: NODE_B, severity: "HIGH", note: "Matching broadband transient 0.42 s after Node A.", sim: true },
  { id: "EV-2042", time: "20:14:36", type: "Acoustic", sensor: NODE_A, severity: "HIGH", note: "Broadband transient, 1.2–4.8 kHz, potential disturbance.", sim: true },
];

// deterministic RNG
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function genWave(seed: number, n = 140, burst: number | null = null, amp = 1): number[] {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const base = Math.sin(i * (0.35 + seed * 0.01)) * 0.12 + (r() - 0.5) * 0.25;
    let b = 0;
    if (burst !== null) { const d = Math.abs(i - burst); if (d < 18) b = Math.sin(i * 1.7) * (1 - d / 18) * 0.95 * (0.7 + r() * 0.3); }
    return (base + b) * amp;
  });
}
export function signalSeries(seed: number, spike: boolean) {
  const r = rng(seed + 99);
  return Array.from({ length: 24 }, (_, i) => ({ t: `${String(i).padStart(2, "0")}m`, v: Math.round(30 + r() * 18 + (spike && i > 19 ? 40 : 0)) }));
}

export const ACTIVITY = Array.from({ length: 14 }, (_, i) => {
  const r = rng(300 + i);
  return { d: `D-${13 - i}`, acoustic: Math.round(2 + r() * 6 + (i === 13 ? 9 : 0)), intel: Math.round(1 + r() * 4 + (i > 10 ? 3 : 0)), reviewed: Math.round(1 + r() * 5) };
});

export const LEAD = {
  id: "DEMO-017",
  title: "Hypothetical Wildlife-Trade Lead",
  category: "Suspected wildlife-trade activity",
  source: "Simulated online intelligence feed",
  evidence: "Fictional listing metadata",
  received: "2026-10-10 18:02 IST",
  confidence: 41,
  summary:
    "A fictional marketplace listing (synthetic data) references 'forest produce' with a posting region overlapping Zone C. Metadata timestamp falls within 48 h of the acoustic incident window. No verification has been performed; this is a training scenario only.",
  linked: ["RPT-311 Patrol note (fictional)", "RPT-318 Vehicle sighting (fictional)", "DEMO-001 Correlated acoustic incident"],
};

export type GNode = { id: string; label: string; cat: "incident" | "sensor" | "lead" | "report" | "location" | "entity"; x: number; y: number; detail: string };
export const GRAPH_NODES: GNode[] = [
  { id: "DEMO-001", label: "Acoustic Incident", cat: "incident", x: 500, y: 300, detail: "Correlated acoustic event, Zone C2/C3. Awaiting human verification." },
  { id: "DEMO-017", label: "Wildlife-Trade Lead", cat: "lead", x: 700, y: 250, detail: "Hypothetical lead from simulated feed. UNVERIFIED." },
  { id: "S-04", label: "Sensor Node A", cat: "sensor", x: 380, y: 210, detail: "Bamboo Hollow — first detection 20:14:36." },
  { id: "S-07", label: "Sensor Node B", cat: "sensor", x: 400, y: 400, detail: "Sal Grove — matched detection 20:14:37." },
  { id: "S-08", label: "Sensor Node 08", cat: "sensor", x: 260, y: 470, detail: "Waterhole — no matching signature." },
  { id: "S-05", label: "Sensor Node 05", cat: "sensor", x: 290, y: 130, detail: "Salt Lick camera — no frames in window." },
  { id: "RPT-311", label: "Patrol Note 311", cat: "report", x: 620, y: 420, detail: "Fictional patrol note: fresh tyre tracks near Sal Grove." },
  { id: "RPT-318", label: "Vehicle Sighting 318", cat: "report", x: 760, y: 470, detail: "Fictional report: unregistered two-wheeler on southern track." },
  { id: "RPT-302", label: "Route Log 302", cat: "report", x: 160, y: 300, detail: "Routine patrol route log — no anomalies." },
  { id: "RPT-325", label: "Market Bulletin 325", cat: "report", x: 860, y: 140, detail: "Synthetic market bulletin used for training." },
  { id: "LOC-C2", label: "Zone C2", cat: "location", x: 560, y: 160, detail: "Bamboo Hollow compartment, 4.2 km²." },
  { id: "LOC-C3", label: "Zone C3", cat: "location", x: 540, y: 520, detail: "Sal Grove compartment, 3.7 km²." },
  { id: "LOC-TRK", label: "Southern Track", cat: "location", x: 880, y: 560, detail: "Unpaved access track, 11 km." },
  { id: "ENT-A", label: "Listing Account α", cat: "entity", x: 880, y: 300, detail: "Fictional pseudonymous account (synthetic)." },
  { id: "ENT-B", label: "Listing Account β", cat: "entity", x: 960, y: 420, detail: "Fictional account, shares posting region with α." },
  { id: "ENT-V", label: "Vehicle Profile V-2", cat: "entity", x: 700, y: 580, detail: "Fictional vehicle descriptor from RPT-318." },
  { id: "S-09", label: "Sensor Node 09", cat: "sensor", x: 740, y: 360, detail: "Southern Track seismic — weak vibration 20:16." },
  { id: "RPT-330", label: "Review Memo 330", cat: "report", x: 120, y: 160, detail: "Template review memo for analyst training." },
];
export type GEdge = { a: string; b: string; kind: "operations" | "reports" | "intelligence"; note: string };
export const GRAPH_EDGES: GEdge[] = [
  { a: "DEMO-001", b: "S-04", kind: "operations", note: "Primary detection source." },
  { a: "DEMO-001", b: "S-07", kind: "operations", note: "Cross-verifying detection (Δt 0.42 s)." },
  { a: "DEMO-001", b: "S-08", kind: "operations", note: "Negative control — no signature." },
  { a: "S-04", b: "S-05", kind: "operations", note: "Mesh relay link." },
  { a: "DEMO-001", b: "LOC-C2", kind: "operations", note: "Estimated area overlaps compartment." },
  { a: "DEMO-001", b: "LOC-C3", kind: "operations", note: "Estimated area overlaps compartment." },
  { a: "DEMO-001", b: "RPT-311", kind: "reports", note: "Patrol note within 600 m of estimated area." },
  { a: "RPT-311", b: "RPT-318", kind: "reports", note: "Same patrol shift (fictional)." },
  { a: "RPT-318", b: "ENT-V", kind: "reports", note: "Vehicle descriptor extracted." },
  { a: "ENT-V", b: "LOC-TRK", kind: "reports", note: "Observed on southern track." },
  { a: "RPT-302", b: "S-08", kind: "reports", note: "Route passes waterhole node." },
  { a: "RPT-330", b: "RPT-302", kind: "reports", note: "Memo references route log." },
  { a: "DEMO-017", b: "DEMO-001", kind: "intelligence", note: "Temporal overlap (< 48 h) — not causal." },
  { a: "DEMO-017", b: "ENT-A", kind: "intelligence", note: "Lead originates from listing α (synthetic)." },
  { a: "ENT-A", b: "ENT-B", kind: "intelligence", note: "Shared posting region metadata." },
  { a: "DEMO-017", b: "RPT-325", kind: "intelligence", note: "Bulletin cited in lead." },
  { a: "DEMO-017", b: "LOC-C2", kind: "intelligence", note: "Approximate region overlap." },
  { a: "S-09", b: "LOC-TRK", kind: "operations", note: "Node installed on track." },
  { a: "S-09", b: "DEMO-001", kind: "operations", note: "Weak follow-up vibration." },
  { a: "ENT-B", b: "RPT-318", kind: "intelligence", note: "Possible descriptor match — low confidence." },
];

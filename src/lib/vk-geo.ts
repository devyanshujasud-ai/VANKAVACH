/**
 * Tadoba-Andhari Tiger Reserve — Geographic Data Module
 * =====================================================
 * All coordinates use WGS84 (EPSG:4326) — [latitude, longitude].
 *
 * GATE LOCATIONS: Verified from publicly available tourism and Maharashtra
 * Forest Department sources.
 *
 * RESERVE BOUNDARIES: Approximate polygons based on publicly available maps
 * and satellite imagery extents. These are NOT official Maharashtra Forest
 * Department survey boundaries. Official GIS shapefiles were not publicly
 * available at the time of development.
 *
 * SENSOR PLACEMENTS: Entirely simulated. No real hardware exists at these
 * positions.
 */

export type LatLng = [number, number]; // [lat, lng]

// ── Reserve center & default view ───────────────────────────────────
export const TADOBA_CENTER: LatLng = [20.2530, 79.3460];
export const DEFAULT_ZOOM = 12;
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 18;

// ── Safari gates (verified public locations) ────────────────────────
export type GateInfo = {
  id: string;
  name: string;
  position: LatLng;
  category: "core-gate" | "buffer-gate";
  notes: string;
};

export const GATES: GateInfo[] = [
  {
    id: "GATE-MOHARLI",
    name: "Moharli Gate",
    position: [20.1874, 79.3548],
    category: "core-gate",
    notes: "Primary entry gate. Most popular tourist entry point in the core zone.",
  },
  {
    id: "GATE-KHUTWANDA",
    name: "Khutwanda Gate",
    position: [20.1780, 79.3960],
    category: "buffer-gate",
    notes: "Buffer zone entry gate near Khutwanda village.",
  },
  {
    id: "GATE-KOLARA",
    name: "Kolara Gate",
    position: [20.2425, 79.4275],
    category: "buffer-gate",
    notes: "Eastern buffer zone gate. Access to Kolara range.",
  },
  {
    id: "GATE-NAVEGAON",
    name: "Navegaon Gate",
    position: [20.2975, 79.3690],
    category: "core-gate",
    notes: "Northern core zone entry gate.",
  },
  {
    id: "GATE-PANGADI",
    name: "Pangadi Gate",
    position: [20.2195, 79.2890],
    category: "buffer-gate",
    notes: "Western buffer zone gate.",
  },
  {
    id: "GATE-ZARI",
    name: "Zari Gate",
    position: [20.3165, 79.3280],
    category: "buffer-gate",
    notes: "Northern buffer zone gate near Zari village.",
  },
];

// ── Approximate reserve boundaries ──────────────────────────────────
// NOTE: These boundaries are approximations based on publicly available
// maps and satellite imagery. They are NOT official survey boundaries.
// The structure is designed so accurate GIS data can be dropped in later.

export type BoundaryLayer = {
  id: string;
  name: string;
  verified: boolean;
  description: string;
  coordinates: LatLng[];
};

export const RESERVE_BOUNDARY: BoundaryLayer = {
  id: "tatr-reserve",
  name: "Tadoba-Andhari Tiger Reserve (Outer Boundary)",
  verified: false,
  description: "Approximate outer boundary. Replace with official GIS data when available.",
  coordinates: [
    [20.3550, 79.2700],
    [20.3580, 79.3150],
    [20.3500, 79.3700],
    [20.3350, 79.4200],
    [20.3100, 79.4500],
    [20.2700, 79.4600],
    [20.2300, 79.4550],
    [20.1900, 79.4400],
    [20.1600, 79.4100],
    [20.1450, 79.3700],
    [20.1400, 79.3200],
    [20.1500, 79.2800],
    [20.1750, 79.2550],
    [20.2100, 79.2450],
    [20.2500, 79.2400],
    [20.2900, 79.2450],
    [20.3250, 79.2550],
  ],
};

export const CORE_BOUNDARY: BoundaryLayer = {
  id: "tatr-core",
  name: "Core Zone (Tadoba National Park)",
  verified: false,
  description: "Approximate core zone. The actual Tadoba National Park core area is ~116.55 km².",
  coordinates: [
    [20.3100, 79.3100],
    [20.3050, 79.3500],
    [20.2900, 79.3800],
    [20.2650, 79.3950],
    [20.2350, 79.3900],
    [20.2100, 79.3750],
    [20.1950, 79.3550],
    [20.1900, 79.3250],
    [20.1950, 79.3000],
    [20.2100, 79.2850],
    [20.2350, 79.2800],
    [20.2650, 79.2850],
    [20.2900, 79.2950],
  ],
};

export const BUFFER_BOUNDARY: BoundaryLayer = {
  id: "tatr-buffer",
  name: "Buffer Zone (Andhari Wildlife Sanctuary + surroundings)",
  verified: false,
  description: "Approximate buffer zone. Actual buffer area is ~1,101.77 km².",
  coordinates: RESERVE_BOUNDARY.coordinates, // Buffer is essentially the outer ring minus core
};

// ── Water bodies (approximate locations) ────────────────────────────
export type WaterBody = {
  id: string;
  name: string;
  position: LatLng;
  type: "lake" | "river" | "waterhole";
};

export const WATER_BODIES: WaterBody[] = [
  { id: "WB-TADOBA", name: "Tadoba Lake", position: [20.2280, 79.3450], type: "lake" },
  { id: "WB-KOLSA", name: "Kolsa Lake", position: [20.2600, 79.3620], type: "lake" },
  { id: "WB-IRAI", name: "Irai Dam / Reservoir", position: [20.1850, 79.3180], type: "lake" },
  { id: "WB-ANDHARI", name: "Andhari River", position: [20.2750, 79.3900], type: "river" },
  { id: "WB-MOHARLI-WH", name: "Moharli Waterhole", position: [20.1950, 79.3520], type: "waterhole" },
  { id: "WB-JAMNI", name: "Jamni Waterhole", position: [20.2400, 79.3300], type: "waterhole" },
];

// ── Simulated sensor positions (within reserve geographic extent) ───
// These map the existing abstract sensor data (vk-data.ts) to real lat/lng
// within the reserve for the Leaflet map.
// NOTE: These are SIMULATED sensor placements, not actual deployed hardware.

export type SensorGeo = {
  id: string;
  position: LatLng;
};

export const SENSOR_GEO: SensorGeo[] = [
  { id: "S-01", position: [20.3000, 79.3100] },  // Ridge North
  { id: "S-02", position: [20.2900, 79.3400] },  // Teak Belt
  { id: "S-03", position: [20.2500, 79.3100] },  // Riverbend
  { id: "S-04", position: [20.2600, 79.3600] },  // Bamboo Hollow (NODE A)
  { id: "S-05", position: [20.2850, 79.3900] },  // Salt Lick
  { id: "S-06", position: [20.2650, 79.4200] },  // Eastern Gate
  { id: "S-07", position: [20.2350, 79.3700] },  // Sal Grove (NODE B)
  { id: "S-08", position: [20.2150, 79.3350] },  // Waterhole
  { id: "S-09", position: [20.2000, 79.3900] },  // Southern Track
  { id: "S-10", position: [20.2200, 79.2950] },  // Watchtower 3
];

// ── Incident location (geo equivalent of INCIDENT in vk-data) ──────
export const INCIDENT_GEO: LatLng = [20.2480, 79.3650];

// Incident polygon (approximate area around the incident point)
export const INCIDENT_POLYGON: LatLng[] = [
  [20.2520, 79.3610],
  [20.2510, 79.3580],
  [20.2530, 79.3560],
  [20.2560, 79.3580],
  [20.2550, 79.3620],
  [20.2540, 79.3660],
  [20.2510, 79.3680],
  [20.2480, 79.3670],
  [20.2460, 79.3640],
  [20.2470, 79.3620],
];

// ── Lookup helpers ──────────────────────────────────────────────────
export function sensorGeoById(id: string): SensorGeo | undefined {
  return SENSOR_GEO.find((s) => s.id === id);
}

export function gateById(id: string): GateInfo | undefined {
  return GATES.find((g) => g.id === id);
}

// ── Tile layer configuration ────────────────────────────────────────
export const TILE_LAYERS = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    name: "Street Map",
  },
  topo: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    name: "Topographic",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
    name: "Satellite",
  },
} as const;

export type TileLayerKey = keyof typeof TILE_LAYERS;

// ── Intelligence feed (simulated) ───────────────────────────────────
export type IntelFeedItem = {
  id: string;
  time: string;
  source: string;
  summary: string;
  confidence: number;
  category: string;
  region: string;
  status: "NEW" | "TRIAGED" | "ARCHIVED";
};

export const INTEL_FEED: IntelFeedItem[] = [
  {
    id: "INTL-041",
    time: "20:55 IST",
    source: "Simulated social media scan",
    summary: "Fictional posting mentioning 'forest produce' from region overlapping buffer zone.",
    confidence: 28,
    category: "Market activity",
    region: "Buffer Zone West",
    status: "NEW",
  },
  {
    id: "INTL-040",
    time: "20:32 IST",
    source: "Simulated patrol radio intercept",
    summary: "Unrecognized radio frequency burst detected near southern track (synthetic data).",
    confidence: 35,
    category: "Communications anomaly",
    region: "Zone S2",
    status: "NEW",
  },
  {
    id: "INTL-039",
    time: "19:48 IST",
    source: "Simulated vehicle tracking",
    summary: "Two-wheeler without registration tag observed near Kolara gate (fictional report).",
    confidence: 52,
    category: "Vehicle movement",
    region: "Buffer Zone East",
    status: "TRIAGED",
  },
  {
    id: "INTL-038",
    time: "18:15 IST",
    source: "Simulated informant network",
    summary: "Fictional tip about unusual foot traffic near Bamboo Hollow between 04:00–06:00.",
    confidence: 44,
    category: "Suspicious activity",
    region: "Zone C2",
    status: "TRIAGED",
  },
  {
    id: "INTL-037",
    time: "16:40 IST",
    source: "Simulated market bulletin",
    summary: "Training scenario: synthetic listing with wildlife-related keywords in neighboring district.",
    confidence: 19,
    category: "Market activity",
    region: "External",
    status: "ARCHIVED",
  },
  {
    id: "INTL-036",
    time: "14:20 IST",
    source: "Simulated drone surveillance",
    summary: "Routine drone patrol — no anomalies detected in core zone (training data).",
    confidence: 8,
    category: "Surveillance",
    region: "Core Zone",
    status: "ARCHIVED",
  },
];

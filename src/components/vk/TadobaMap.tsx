/**
 * TadobaMap — Shared interactive Leaflet map component
 * =====================================================
 * Real geographic tiles over Tadoba-Andhari Tiger Reserve.
 * Used across dashboard, incident-area, and overview screens.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Circle,
  CircleMarker,
  Polyline,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  TADOBA_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  TILE_LAYERS,
  RESERVE_BOUNDARY,
  CORE_BOUNDARY,
  GATES,
  WATER_BODIES,
  SENSOR_GEO,
  INCIDENT_GEO,
  INCIDENT_POLYGON,
  sensorGeoById,
  type LatLng,
  type TileLayerKey,
  type GateInfo,
} from "@/lib/vk-geo";
import { SENSORS, LINKS, NODE_A, NODE_B, sensorById } from "@/lib/vk-data";
import { cn } from "@/lib/utils";

// ── Fix Leaflet default icon issue with bundlers ────────────────────
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as Record<string, unknown>)["_getIconUrl"];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ── Custom marker icons ─────────────────────────────────────────────
function createSvgIcon(color: string, size: number, glow = false): L.DivIcon {
  const shadow = glow ? `filter: drop-shadow(0 0 6px ${color});` : "";
  return L.divIcon({
    className: "vk-map-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5" style="${shadow}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" fill="${color}"/>
    </svg>`,
  });
}

function createGateIcon(): L.DivIcon {
  return L.divIcon({
    className: "vk-gate-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="20" height="20" rx="3" fill="oklch(0.22 0.022 165)" stroke="oklch(0.76 0.11 168)" stroke-width="1.5"/>
      <path d="M9 10h10M14 10v8M9 18h10" stroke="oklch(0.76 0.11 168)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`,
  });
}

function createWaterIcon(): L.DivIcon {
  return L.divIcon({
    className: "vk-water-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="oklch(0.32 0.04 210)" fill-opacity="0.4" stroke="oklch(0.32 0.04 210)" stroke-width="1.2"/>
      <path d="M6 10 Q10 6 14 10 Q10 14 6 10Z" fill="oklch(0.32 0.04 210)" fill-opacity="0.6"/>
    </svg>`,
  });
}

function createIncidentIcon(): L.DivIcon {
  return L.divIcon({
    className: "vk-incident-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="none" stroke="oklch(0.78 0.16 70)" stroke-width="1.5" opacity="0.6">
        <animate attributeName="r" from="6" to="14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="16" cy="16" r="8" fill="oklch(0.78 0.16 70)" fill-opacity="0.3" stroke="oklch(0.78 0.16 70)" stroke-width="1.5"/>
      <line x1="12" y1="16" x2="20" y2="16" stroke="oklch(0.18 0.03 60)" stroke-width="2"/>
      <line x1="16" y1="12" x2="16" y2="20" stroke="oklch(0.18 0.03 60)" stroke-width="2"/>
      <circle cx="16" cy="16" r="3" fill="oklch(0.78 0.16 70)"/>
    </svg>`,
  });
}

// ── Map controller sub-component ────────────────────────────────────
function MapController({ flyTo, flyZoom }: { flyTo?: LatLng | null; flyZoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo, flyZoom ?? map.getZoom(), { duration: 1.2 });
    }
  }, [flyTo, flyZoom, map]);
  return null;
}

function RecenterButton() {
  const map = useMap();
  return (
    <button
      className="vk-map-btn"
      title="Recenter on Tadoba"
      onClick={() => map.flyTo(TADOBA_CENTER, DEFAULT_ZOOM, { duration: 1 })}
      style={{
        position: "absolute",
        bottom: 100,
        right: 10,
        zIndex: 1000,
        width: 34,
        height: 34,
        background: "oklch(0.215 0.022 165)",
        border: "1px solid oklch(0.36 0.02 165)",
        borderRadius: "2px",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        color: "oklch(0.66 0.025 160)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="3" />
        <line x1="8" y1="0" x2="8" y2="4" />
        <line x1="8" y1="12" x2="8" y2="16" />
        <line x1="0" y1="8" x2="4" y2="8" />
        <line x1="12" y1="8" x2="16" y2="8" />
      </svg>
    </button>
  );
}

// ── Map layer legend ────────────────────────────────────────────────
function MapLegend({ showSensors, showIncident }: { showSensors: boolean; showIncident: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        zIndex: 1000,
        background: "oklch(0.215 0.022 165 / 0.92)",
        border: "1px solid oklch(0.36 0.02 165)",
        borderRadius: "2px",
        padding: "8px 12px",
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: "10px",
        letterSpacing: "0.08em",
        color: "oklch(0.66 0.025 160)",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="oklch(0.76 0.11 168)" /></svg>
        SENSOR (SIMULATED)
      </span>
      {showIncident && (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="oklch(0.78 0.16 70)" /></svg>
          INCIDENT
        </span>
      )}
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="10" height="10"><rect x="1" y="1" width="8" height="8" rx="2" fill="none" stroke="oklch(0.76 0.11 168)" strokeWidth="1.5" /></svg>
        GATE
      </span>
      {showSensors && (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="14" height="4"><line x1="0" y1="2" x2="14" y2="2" stroke="oklch(0.76 0.11 168)" strokeWidth="1" strokeDasharray="3 2" /></svg>
          MESH LINK
        </span>
      )}
      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "oklch(0.78 0.16 70)" }}>
        ⚠ BOUNDARIES APPROXIMATE
      </span>
    </div>
  );
}

// ── Main TadobaMap component ────────────────────────────────────────
export type TadobaMapProps = {
  className?: string;
  /** Sensor status override function */
  sensorStatus?: (id: string) => "online" | "offline" | "alert";
  /** Selected sensor ID */
  selectedSensor?: string | null;
  /** Callback when a sensor marker is clicked */
  onSensorClick?: (id: string) => void;
  /** Show the simulated incident overlay */
  showIncident?: boolean;
  /** Show sensor markers & mesh links */
  showSensors?: boolean;
  /** Show reserve boundary layers */
  showBoundaries?: boolean;
  /** Show gate markers */
  showGates?: boolean;
  /** Show water body markers */
  showWater?: boolean;
  /** Show triangulation lines to incident */
  showTriangulation?: boolean;
  /** Fly the map to this position */
  flyTo?: LatLng | null;
  /** Zoom level for flyTo */
  flyZoom?: number;
  /** Default tile layer */
  defaultTileLayer?: TileLayerKey;
  /** Extra children rendered inside MapContainer */
  children?: ReactNode;
  /** Overlay rendered above the map (absolute positioned) */
  overlay?: ReactNode;
};

export function TadobaMap({
  className,
  sensorStatus,
  selectedSensor,
  onSensorClick,
  showIncident = false,
  showSensors = true,
  showBoundaries = true,
  showGates = true,
  showWater = true,
  showTriangulation = false,
  flyTo,
  flyZoom,
  defaultTileLayer = "osm",
  children,
  overlay,
}: TadobaMapProps) {
  const [ready, setReady] = useState(false);

  const getStatus = (id: string) => {
    if (sensorStatus) return sensorStatus(id);
    const s = sensorById(id);
    return s.status;
  };

  const sensorColor = (id: string) => {
    const st = getStatus(id);
    if (st === "alert") return "oklch(0.78 0.16 70)";
    if (st === "offline") return "oklch(0.66 0.025 160)";
    return "oklch(0.76 0.11 168)";
  };

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ minHeight: 400 }}>
      <MapContainer
        center={TADOBA_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        style={{ height: "100%", width: "100%", background: "oklch(0.17 0.018 170)" }}
        whenReady={() => setReady(true)}
      >
        {/* Tile layers with layer control */}
        <LayersControl position="topright">
          {(Object.entries(TILE_LAYERS) as [TileLayerKey, typeof TILE_LAYERS[TileLayerKey]][]).map(
            ([key, layer]) => (
              <LayersControl.BaseLayer
                key={key}
                checked={key === defaultTileLayer}
                name={layer.name}
              >
                <TileLayer url={layer.url} attribution={layer.attribution} />
              </LayersControl.BaseLayer>
            )
          )}
        </LayersControl>

        {/* Map controls */}
        <MapController flyTo={flyTo} flyZoom={flyZoom} />
        <RecenterButton />

        {/* Reserve boundaries */}
        {showBoundaries && (
          <>
            <Polygon
              positions={RESERVE_BOUNDARY.coordinates}
              pathOptions={{
                color: "oklch(0.76 0.11 168)",
                weight: 2,
                opacity: 0.5,
                fillColor: "oklch(0.76 0.11 168)",
                fillOpacity: 0.04,
                dashArray: "8 4",
              }}
            >
              <Popup>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
                  <strong>{RESERVE_BOUNDARY.name}</strong>
                  <br />
                  <span style={{ color: "#b0a080", fontSize: 10 }}>⚠ {RESERVE_BOUNDARY.description}</span>
                </div>
              </Popup>
            </Polygon>
            <Polygon
              positions={CORE_BOUNDARY.coordinates}
              pathOptions={{
                color: "oklch(0.76 0.11 168)",
                weight: 2.5,
                opacity: 0.7,
                fillColor: "oklch(0.76 0.11 168)",
                fillOpacity: 0.08,
              }}
            >
              <Popup>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
                  <strong>{CORE_BOUNDARY.name}</strong>
                  <br />
                  <span style={{ color: "#b0a080", fontSize: 10 }}>⚠ {CORE_BOUNDARY.description}</span>
                </div>
              </Popup>
            </Polygon>
          </>
        )}

        {/* Water bodies */}
        {showWater &&
          WATER_BODIES.map((wb) => (
            <Marker key={wb.id} position={wb.position} icon={createWaterIcon()}>
              <Popup>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
                  <strong>{wb.name}</strong>
                  <br />
                  Type: {wb.type}
                  <br />
                  {wb.position[0].toFixed(4)}°N, {wb.position[1].toFixed(4)}°E
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Gate markers */}
        {showGates &&
          GATES.map((gate) => (
            <Marker key={gate.id} position={gate.position} icon={createGateIcon()}>
              <Popup>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
                  <strong>{gate.name}</strong>
                  <br />
                  Category: {gate.category}
                  <br />
                  {gate.notes}
                  <br />
                  <span style={{ fontSize: 10, opacity: 0.7 }}>
                    {gate.position[0].toFixed(4)}°N, {gate.position[1].toFixed(4)}°E
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Sensor mesh links */}
        {showSensors &&
          LINKS.map(([a, b]) => {
            const geoA = sensorGeoById(a);
            const geoB = sensorGeoById(b);
            if (!geoA || !geoB) return null;
            const isHot =
              showIncident &&
              ((a === NODE_A && b === NODE_B) || (b === NODE_A && a === NODE_B));
            return (
              <Polyline
                key={`${a}-${b}`}
                positions={[geoA.position, geoB.position]}
                pathOptions={{
                  color: isHot ? "oklch(0.78 0.16 70)" : "oklch(0.76 0.11 168)",
                  weight: isHot ? 2 : 1,
                  opacity: isHot ? 0.8 : 0.3,
                  dashArray: "4 6",
                }}
              />
            );
          })}

        {/* Sensor markers */}
        {showSensors &&
          SENSOR_GEO.map((sg) => {
            const sensor = sensorById(sg.id);
            const st = getStatus(sg.id);
            const isSelected = selectedSensor === sg.id;
            const size = st === "alert" ? 24 : 18;
            return (
              <Marker
                key={sg.id}
                position={sg.position}
                icon={createSvgIcon(sensorColor(sg.id), size, st === "alert")}
                eventHandlers={{
                  click: () => onSensorClick?.(sg.id),
                }}
              >
                <Popup>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, minWidth: 180 }}>
                    <strong>{sensor.label}</strong>
                    <br />
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{sg.id} · {sensor.name} · {sensor.type}</span>
                    <br />
                    Status: <span style={{ color: st === "alert" ? "#e0a040" : st === "offline" ? "#888" : "#6dbd8a" }}>{st.toUpperCase()}</span>
                    <br />
                    Battery: {sensor.battery}% · Signal: {sensor.signal ? `${sensor.signal}%` : "—"}
                    <br />
                    Zone: {sensor.zone}
                    <br />
                    <span style={{ fontSize: 9, opacity: 0.5, fontStyle: "italic" }}>SIMULATED SENSOR PLACEMENT</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Incident overlay */}
        {showIncident && (
          <>
            {/* Incident area polygon */}
            <Polygon
              positions={INCIDENT_POLYGON}
              pathOptions={{
                color: "oklch(0.78 0.16 70)",
                weight: 1.5,
                opacity: 0.8,
                fillColor: "oklch(0.78 0.16 70)",
                fillOpacity: 0.15,
                dashArray: "4 2",
              }}
            >
              <Popup>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
                  <strong>DEMO-001 — Estimated Incident Area</strong>
                  <br />
                  Area: ≈ 0.38 km² (± 140 m)
                  <br />
                  Status: Awaiting human verification
                  <br />
                  <span style={{ fontSize: 9, opacity: 0.5 }}>SIMULATED</span>
                </div>
              </Popup>
            </Polygon>

            {/* Pulsing incident center */}
            <Marker position={INCIDENT_GEO} icon={createIncidentIcon()}>
              <Popup>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
                  <strong>DEMO-001 — Incident Center</strong>
                  <br />
                  Type: Acoustic disturbance
                  <br />
                  {INCIDENT_GEO[0].toFixed(4)}°N, {INCIDENT_GEO[1].toFixed(4)}°E
                </div>
              </Popup>
            </Marker>

            {/* Ripple circles */}
            {[200, 400, 600].map((r) => (
              <Circle
                key={r}
                center={INCIDENT_GEO}
                radius={r}
                pathOptions={{
                  color: "oklch(0.78 0.16 70)",
                  weight: 0.8,
                  opacity: 0.2,
                  fill: false,
                  dashArray: "3 6",
                }}
              />
            ))}
          </>
        )}

        {/* Triangulation lines */}
        {showTriangulation && showIncident && (
          <>
            {[NODE_A, NODE_B].map((nodeId) => {
              const geo = sensorGeoById(nodeId);
              if (!geo) return null;
              return (
                <Polyline
                  key={`tri-${nodeId}`}
                  positions={[geo.position, INCIDENT_GEO]}
                  pathOptions={{
                    color: "oklch(0.78 0.16 70)",
                    weight: 1.8,
                    opacity: 0.7,
                    dashArray: "6 4",
                  }}
                />
              );
            })}
            {/* Additional reference lines from nearby sensors */}
            {["S-02", "S-03", "S-05", "S-08", "S-09"].map((id) => {
              const geo = sensorGeoById(id);
              if (!geo) return null;
              return (
                <Polyline
                  key={`ref-${id}`}
                  positions={[geo.position, INCIDENT_GEO]}
                  pathOptions={{
                    color: "oklch(0.76 0.11 168)",
                    weight: 0.8,
                    opacity: 0.3,
                  }}
                />
              );
            })}
          </>
        )}

        {children}
      </MapContainer>

      {/* Legend */}
      <MapLegend showSensors={showSensors} showIncident={showIncident} />

      {/* Overlay (absolute positioned content on top of map) */}
      {overlay}
    </div>
  );
}

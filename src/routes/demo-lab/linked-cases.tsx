import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  GitFork,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Shield,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  FileText,
  Radio,
  Camera,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  X,
  ExternalLink,
} from "lucide-react";
import { useDemoLab } from "@/lib/demo-lab-store";
import {
  type FieldAlert,
  type LinkedCase,
} from "@/lib/demo-lab-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo-lab/linked-cases")({
  head: () => ({
    meta: [
      { title: "Linked Case Investigation Dashboard | VANKAVACH DEMO LAB" },
      {
        name: "description",
        content:
          "Professional investigation workspace correlating field surveillance events with online cyber leads using interactive node graphs and spatiotemporal matching.",
      },
    ],
  }),
  component: LinkedCasesDashboard,
});

function LinkedCasesDashboard() {
  const lab = useDemoLab();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeNodeModal, setActiveNodeModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCase =
    lab.linkedCases.find((c) => c.id === lab.selectedCaseId) || lab.linkedCases[0];

  const filteredCases = useMemo(() => {
    return lab.linkedCases.filter((c) => {
      if (lab.caseFilter !== "ALL" && c.reviewStatus !== lab.caseFilter) return false;
      if (
        searchQuery &&
        !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.fieldEvent.location.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [lab.linkedCases, lab.caseFilter, searchQuery]);

  // Graph Nodes Definition
  const graphNodes = useMemo(() => {
    if (!selectedCase) return [];
    return [
      {
        id: "NODE-FIELD-OPTICAL",
        label: "Camera Detection",
        sub: selectedCase.fieldEvent.id,
        kind: "CAMERA",
        x: 80,
        y: 80,
        status: "CONFIRMED",
        color: "#55D6A3",
        details: selectedCase.fieldEvent.details,
      },
      {
        id: "NODE-FIELD-ACOUSTIC",
        label: "Acoustic Disruption",
        sub: "EV-2042 (S-04/S-07)",
        kind: "ACOUSTIC",
        x: 80,
        y: 220,
        status: "CONFIRMED",
        color: "#F4A62A",
        details: "Gunshot/Axe acoustic impulse signature correlated across dual audio telemetry sensors.",
      },
      {
        id: "NODE-FIELD-AGG",
        label: "Field Incident Cluster",
        sub: "Kolsa Sector 4",
        kind: "CLUSTER",
        x: 290,
        y: 150,
        status: "CORRELATED",
        color: "#55D6A3",
        details: "Spatiotemporal aggregation of optical lock and audio disturbance.",
      },
      {
        id: "NODE-ONLINE-LEAD",
        label: "Online Cyber Listing",
        sub: selectedCase.onlineListing.id,
        kind: "CYBER",
        x: 490,
        y: 70,
        status: "MATCHED",
        color: "#F4A62A",
        details: `${selectedCase.onlineListing.title} (${selectedCase.onlineListing.platform})`,
      },
      {
        id: "NODE-LINKED-CASE",
        label: "Linked Tactical Case",
        sub: selectedCase.id,
        kind: "CASE",
        x: 490,
        y: 230,
        status: "ACTIVE",
        color: "#55D6A3",
        details: `Correlation Score: ${selectedCase.correlationScore}% · Spatiotemporal gap: ${selectedCase.dateDifferenceDays}d`,
      },
      {
        id: "NODE-HUMAN-REVIEW",
        label: "Duty Analyst Review",
        sub: "Analyst R. Mehta",
        kind: "REVIEW",
        x: 710,
        y: 150,
        status: selectedCase.reviewStatus,
        color: selectedCase.reviewStatus === "REVIEWED" ? "#55D6A3" : "#F4A62A",
        details: "Transmitted to Duty Desk for human-in-the-loop review and CCF escalation.",
      },
    ];
  }, [selectedCase]);

  // Total metrics
  const totalCasesCount = lab.linkedCases.length;
  const pendingReviewCount = lab.linkedCases.filter((c) => c.reviewStatus === "PENDING_REVIEW").length;
  const avgMatchScore =
    Math.round(
      (lab.linkedCases.reduce((acc, c) => acc + c.correlationScore, 0) / (totalCasesCount || 1)) * 10
    ) / 10;

  return (
    <div className="flex h-full flex-col bg-[#07110E] text-[#E8F0EB] select-none font-sans overflow-hidden">
      {/* Top Banner / Breadcrumb Strip */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#263A30] bg-[#0B1712] px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C9F92]">
            <span className="text-[#55D6A3] font-bold">DEMO LAB</span>
            <span>/</span>
            <span className="text-[#E8F0EB] uppercase tracking-wider font-semibold">
              Linked Case Investigation Dashboard
            </span>
          </div>
          <span className="rounded bg-[#55D6A3]/10 border border-[#55D6A3]/30 px-2 py-0.5 font-mono text-[10px] text-[#55D6A3]">
            LOCAL CORRELATION ENGINE ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => lab.setEvidenceModalOpen(true)}
            className="flex items-center gap-1.5 rounded bg-[#101F18] border border-[#263A30] px-2.5 py-1 text-[11px] text-[#55D6A3] hover:border-[#55D6A3] transition-colors"
          >
            <Eye size={12} /> VIEW EVIDENCE DOSSIER
          </button>
          <div className="h-3 w-px bg-[#263A30]" />
          <button
            onClick={lab.resetAll}
            className="flex items-center gap-1.5 rounded border border-[#263A30] bg-[#101F18] px-2.5 py-1 text-[11px] text-[#8C9F92] hover:text-[#E8F0EB] hover:border-[#55D6A3]/50 transition-colors"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </div>

      {/* Top Case Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#263A30] border-b border-[#263A30] bg-[#0B1712]">
        <div className="p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">Total Linked Cases</div>
            <div className="text-xl font-mono font-bold text-[#E8F0EB] mt-0.5">{totalCasesCount} Cases</div>
          </div>
          <GitFork size={18} className="text-[#55D6A3]" />
        </div>

        <div className="p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">Pending Duty Review</div>
            <div className="text-xl font-mono font-bold text-[#F4A62A] mt-0.5">{pendingReviewCount} Cases</div>
          </div>
          <Clock size={18} className="text-[#F4A62A]" />
        </div>

        <div className="p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">Correlated Records</div>
            <div className="text-xl font-mono font-bold text-[#55D6A3] mt-0.5">{totalCasesCount * 2} Events</div>
          </div>
          <Shield size={18} className="text-[#55D6A3]" />
        </div>

        <div className="p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">Avg Match Confidence</div>
            <div className="text-xl font-mono font-bold text-[#E8F0EB] mt-0.5">{avgMatchScore}%</div>
          </div>
          <span className="font-mono text-[10px] text-[#55D6A3] bg-[#55D6A3]/10 px-1.5 py-0.5 rounded border border-[#55D6A3]/30">
            DETERMINISTIC
          </span>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="grid flex-1 grid-cols-12 min-h-0 divide-x divide-[#263A30] overflow-hidden">
        {/* ==================================================== */}
        {/* LEFT PANEL: FIELD ALERTS & CASES LIST (Col 3)        */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0 bg-[#0B1712] overflow-y-auto">
          {/* Filter & Search Bar */}
          <div className="p-3 border-b border-[#263A30] space-y-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2.5 text-[#8C9F92]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case or location..."
                className="w-full rounded border border-[#263A30] bg-[#101F18] py-1.5 pl-8 pr-2 text-xs text-[#E8F0EB] placeholder:text-[#8C9F92]/60 focus:border-[#55D6A3] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 font-mono text-[10px]">
              {(["ALL", "PENDING_REVIEW", "REVIEWED"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => lab.setCaseFilter(f)}
                  className={cn(
                    "px-2 py-0.5 rounded border transition-colors",
                    lab.caseFilter === f
                      ? "border-[#55D6A3] bg-[#55D6A3]/15 text-[#55D6A3] font-bold"
                      : "border-[#263A30] bg-[#101F18] text-[#8C9F92]"
                  )}
                >
                  {f === "ALL" ? "All" : f === "PENDING_REVIEW" ? "Pending" : "Reviewed"}
                </button>
              ))}
            </div>
          </div>

          {/* Cases List */}
          <div className="p-3 border-b border-[#263A30] space-y-2">
            <span className="font-mono text-[10px] font-bold text-[#8C9F92] uppercase block">
              Correlated Cases ({filteredCases.length})
            </span>

            <div className="space-y-1.5">
              {filteredCases.map((c) => {
                const isSelected = c.id === selectedCase?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => lab.selectCase(c.id)}
                    className={cn(
                      "w-full text-left rounded p-2.5 border transition-all relative",
                      isSelected
                        ? "border-[#55D6A3] bg-[#101F18] shadow-[0_0_15px_-4px_rgba(85,214,163,0.3)]"
                        : "border-[#263A30] bg-[#0E1B15] hover:bg-[#12221A]"
                    )}
                  >
                    {isSelected && <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#55D6A3]" />}
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-[#55D6A3]">{c.id}</span>
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                          c.reviewStatus === "PENDING_REVIEW"
                            ? "bg-[#F4A62A]/20 text-[#F4A62A]"
                            : "bg-[#55D6A3]/20 text-[#55D6A3]"
                        )}
                      >
                        {c.reviewStatus.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-1 text-xs font-semibold text-[#E8F0EB] truncate">
                      {c.title}
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-[#8C9F92]">
                      <span>Match: {c.correlationScore}%</span>
                      <span>Gap: {c.dateDifferenceDays}d</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field Alerts List */}
          <div className="p-3 flex-1 flex flex-col min-h-0 space-y-2">
            <span className="font-mono text-[10px] font-bold text-[#8C9F92] uppercase block">
              Active Field Alerts
            </span>

            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
              {lab.fieldAlerts.map((alert) => {
                const isSelected = alert.id === lab.selectedFieldAlertId;
                return (
                  <button
                    key={alert.id}
                    onClick={() => lab.selectFieldAlert(alert.id)}
                    className={cn(
                      "w-full text-left rounded p-2 border text-xs transition-colors",
                      isSelected
                        ? "border-[#55D6A3] bg-[#162A20]"
                        : "border-[#263A30] bg-[#101F18] hover:border-[#55D6A3]/40"
                    )}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#55D6A3] font-bold">{alert.id}</span>
                      <span
                        className={cn(
                          "px-1 rounded text-[9px] font-bold",
                          alert.severity === "CRITICAL"
                            ? "bg-[#F05B51]/20 text-[#F05B51]"
                            : alert.severity === "HIGH"
                            ? "bg-[#F4A62A]/20 text-[#F4A62A]"
                            : "bg-[#55D6A3]/20 text-[#55D6A3]"
                        )}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <div className="mt-1 font-semibold text-[#E8F0EB] truncate">
                      {alert.detectedClass}
                    </div>
                    <div className="text-[10px] text-[#8C9F92] truncate mt-0.5">
                      {alert.location}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* CENTER PANEL: RELATIONSHIP GRAPH (Col 5)             */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0 bg-[#07110E] p-3 overflow-hidden">
          {/* Graph Toolbar */}
          <div className="flex items-center justify-between pb-2 border-b border-[#263A30] font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#8C9F92] uppercase">
                Interactive Graph:
              </span>
              <span className="text-[#55D6A3] font-bold">
                CAMERA ➔ CLUSTER ➔ ONLINE ➔ CASE ➔ REVIEW
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                className="p-1 rounded border border-[#263A30] bg-[#101F18] hover:text-[#55D6A3]"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1 rounded border border-[#263A30] bg-[#101F18] hover:text-[#55D6A3]"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded border border-[#263A30] bg-[#101F18] hover:text-[#55D6A3]"
                title="Reset Zoom"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Graph SVG Canvas */}
          <div className="relative flex-1 rounded border border-[#263A30] bg-[#050C0A] overflow-hidden my-2">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(#55D6A3 1px, transparent 1px), linear-gradient(90deg, #55D6A3 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <svg
              viewBox="0 0 820 320"
              className="h-full w-full select-none"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
            >
              <defs>
                <linearGradient id="mintWire" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#55D6A3" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#55D6A3" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="amberWire" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F4A62A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F4A62A" stopOpacity="0.3" />
                </linearGradient>

                <filter id="glowMint" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Edge Connections */}
              {/* Edge 1: Camera -> Cluster (Solid Mint) */}
              <path
                d="M 170 80 Q 230 80, 290 150"
                stroke="#55D6A3"
                strokeWidth="2"
                fill="none"
                filter="url(#glowMint)"
              />
              {/* Edge 2: Acoustic -> Cluster (Solid Mint) */}
              <path
                d="M 170 220 Q 230 220, 290 150"
                stroke="#55D6A3"
                strokeWidth="2"
                fill="none"
              />
              {/* Edge 3: Cluster -> Online Lead (Amber Dashed Correlation) */}
              <path
                d="M 400 150 Q 440 70, 490 70"
                stroke="#F4A62A"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                fill="none"
                className="anim-dash"
              />
              {/* Edge 4: Cluster -> Linked Case (Solid Mint) */}
              <path
                d="M 400 150 Q 440 230, 490 230"
                stroke="#55D6A3"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Edge 5: Online Lead -> Linked Case (Amber Dashed) */}
              <path
                d="M 550 115 L 550 185"
                stroke="#F4A62A"
                strokeWidth="2"
                strokeDasharray="5 3"
                fill="none"
              />
              {/* Edge 6: Linked Case -> Human Review (Solid Mint) */}
              <path
                d="M 600 230 Q 650 230, 710 150"
                stroke="#55D6A3"
                strokeWidth="2"
                fill="none"
              />

              {/* Render Animated Traveling Pulses on SVG Edges */}
              <circle cx="230" cy="115" r="3.5" fill="#55D6A3" className="anim-pulse" />
              <circle cx="445" cy="110" r="3.5" fill="#F4A62A" className="anim-pulse" />
              <circle cx="655" cy="190" r="3.5" fill="#55D6A3" className="anim-pulse" />

              {/* Render Nodes */}
              {graphNodes.map((node) => (
                <g
                  key={node.id}
                  transform={`translate(${node.x - 70}, ${node.y - 40})`}
                  className="cursor-pointer group"
                  onClick={() => setActiveNodeModal(node.id)}
                >
                  {/* Outer glow background */}
                  <rect
                    width="140"
                    height="70"
                    rx="5"
                    fill="#101F18"
                    stroke={node.color}
                    strokeWidth="1.5"
                    className="group-hover:stroke-white transition-colors"
                  />
                  {/* Header strip */}
                  <rect width="140" height="20" rx="5" fill="#162B21" />

                  {/* Node Title */}
                  <text
                    x="70"
                    y="14"
                    fill="#E8F0EB"
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>

                  {/* Node Subtitle */}
                  <text
                    x="70"
                    y="38"
                    fill={node.color}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {node.sub}
                  </text>

                  {/* Status Badge */}
                  <text
                    x="70"
                    y="55"
                    fill="#8C9F92"
                    fontSize="8"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    [{node.status}]
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Graph Legend & Status Notes */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8C9F92] bg-[#0B1712] p-2 rounded border border-[#263A30]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 bg-[#55D6A3] rounded-sm inline-block" />
                <span>Confirmed Edge</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 border-b-2 border-dashed border-[#F4A62A] inline-block" />
                <span>Spatiotemporal Correlation (Amber)</span>
              </span>
            </div>
            <span className="text-[#55D6A3]">Click any node to inspect telemetry</span>
          </div>

          {/* Combined Dual-Track Event Timeline */}
          <div className="mt-2 rounded border border-[#263A30] bg-[#0B1712] p-2.5">
            <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] text-[#8C9F92]">
              <span className="font-bold uppercase text-[#E8F0EB]">
                Chronological Correlation Timeline
              </span>
              <span>7-Day Spatiotemporal Window</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {/* Track 1: Field Events */}
              <div className="flex items-center gap-2">
                <span className="w-16 text-[10px] text-[#55D6A3] font-bold">FIELD:</span>
                <div className="flex-1 bg-[#101F18] h-5 rounded border border-[#263A30] relative flex items-center px-2">
                  <div className="absolute left-[20%] text-[9px] bg-[#55D6A3] text-black px-1.5 rounded font-bold">
                    CAM-EV-102 (Oct 09)
                  </div>
                  <div className="absolute left-[75%] text-[9px] bg-[#F05B51] text-white px-1.5 rounded font-bold ring-2 ring-red-400">
                    CAM-EV-108 (Oct 10 20:18)
                  </div>
                </div>
              </div>

              {/* Track 2: Online Leads */}
              <div className="flex items-center gap-2">
                <span className="w-16 text-[10px] text-[#F4A62A] font-bold">CYBER:</span>
                <div className="flex-1 bg-[#101F18] h-5 rounded border border-[#263A30] relative flex items-center px-2">
                  <div className="absolute left-[65%] text-[9px] bg-[#F4A62A] text-black px-1.5 rounded font-bold ring-2 ring-yellow-400">
                    LIST-901 (Oct 09 21:30)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT PANEL: SELECTED CASE DETAILS (Col 4)          */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-4 flex flex-col min-h-0 bg-[#0B1712] p-4 overflow-y-auto space-y-3.5">
          {selectedCase ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#263A30]">
                <div>
                  <span className="font-mono text-sm font-bold text-[#55D6A3]">
                    {selectedCase.id}
                  </span>
                  <div className="text-[10px] font-mono text-[#8C9F92]">
                    CORRELATED INCIDENT DOSSIER
                  </div>
                </div>

                <span
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase",
                    selectedCase.reviewStatus === "PENDING_REVIEW"
                      ? "bg-[#F4A62A]/20 text-[#F4A62A] border border-[#F4A62A]/40"
                      : "bg-[#55D6A3]/20 text-[#55D6A3] border border-[#55D6A3]/40"
                  )}
                >
                  {selectedCase.reviewStatus.replace("_", " ")}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[#E8F0EB] leading-snug">
                {selectedCase.title}
              </h3>

              {/* Correlation Score Banner */}
              <div className="rounded border border-[#55D6A3]/50 bg-[#55D6A3]/10 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C9F92] font-bold">
                    Demonstration Match Score
                  </span>
                  <div className="text-2xl font-mono font-bold text-[#55D6A3]">
                    {selectedCase.correlationScore}%
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono text-[#E8F0EB]">
                  <div className="flex items-center gap-1 text-[#55D6A3]">
                    <CheckCircle2 size={13} />
                    <span>District: MATCH</span>
                  </div>
                  <div className="text-[#8C9F92] mt-0.5">
                    Gap: +{selectedCase.dateDifferenceDays} Days
                  </div>
                </div>
              </div>

              {/* Linked Field Event Card */}
              <div className="rounded border border-[#263A30] bg-[#101F18] p-3 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[#8C9F92] uppercase font-bold">Linked Field Event</span>
                  <span className="text-[#55D6A3] font-bold">{selectedCase.fieldEvent.id}</span>
                </div>
                <div className="text-xs font-bold text-[#E8F0EB]">
                  {selectedCase.fieldEvent.detectedClass}
                </div>
                <div className="text-[11px] text-[#8C9F92]">
                  {selectedCase.fieldEvent.location} · {selectedCase.fieldEvent.district}
                </div>
                <div className="text-[10px] font-mono text-[#8C9F92] pt-1">
                  Time: {selectedCase.fieldEvent.timestamp}
                </div>
              </div>

              {/* Linked Online Listing Card */}
              <div className="rounded border border-[#263A30] bg-[#101F18] p-3 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[#8C9F92] uppercase font-bold">Linked Online Lead</span>
                  <span className="text-[#F4A62A] font-bold">{selectedCase.onlineListing.id}</span>
                </div>
                <div className="text-xs font-bold text-[#E8F0EB] truncate">
                  {selectedCase.onlineListing.title}
                </div>
                <div className="text-[11px] text-[#8C9F92]">
                  Platform: {selectedCase.onlineListing.platform.split(" [")[0]}
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedCase.onlineListing.matchedKeywords.slice(0, 3).map((kw, i) => (
                    <span
                      key={i}
                      className="rounded bg-[#07110E] px-1.5 py-0.5 font-mono text-[9px] text-[#55D6A3] border border-[#263A30]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Correlation Reasons List */}
              <div className="rounded border border-[#263A30] bg-[#0E1B15] p-3 space-y-2">
                <span className="text-[10px] font-mono text-[#8C9F92] uppercase font-bold block">
                  Deterministic Match Reasons
                </span>
                <ul className="space-y-1.5 text-xs text-[#E8F0EB]/90">
                  {selectedCase.correlationReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#55D6A3] font-bold mt-0.5">›</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => lab.submitCaseForReview(selectedCase.id)}
                    className="py-2 px-3 rounded text-xs font-mono font-bold bg-[#F4A62A] text-black hover:bg-[#e0931d] transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 size={13} />
                    SUBMIT REVIEW
                  </button>

                  <button
                    onClick={() => lab.markCaseReviewed(selectedCase.id)}
                    className="py-2 px-3 rounded text-xs font-mono font-bold bg-[#55D6A3] text-black hover:bg-[#48be8f] transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 size={13} />
                    MARK REVIEWED
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => lab.setEvidenceModalOpen(true)}
                    className="py-2 px-3 rounded text-xs font-mono font-bold border border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB] hover:bg-[#162A20] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye size={13} />
                    VIEW EVIDENCE
                  </button>

                  <button
                    onClick={() => lab.escalateCase(selectedCase.id)}
                    className="py-2 px-3 rounded text-xs font-mono font-bold border border-[#F05B51]/50 bg-[#F05B51]/10 text-[#F05B51] hover:bg-[#F05B51]/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert size={13} />
                    ESCALATE CCF
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-[#8C9F92]">
              Select a case from the list to view correlated evidence.
            </div>
          )}
        </div>
      </div>

      {/* Evidence Dossier Modal */}
      {lab.evidenceModalOpen && selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => lab.setEvidenceModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded border border-[#55D6A3]/60 bg-[#0B1712] p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#263A30] pb-3">
              <div>
                <span className="font-mono text-xs text-[#55D6A3] font-bold">
                  EVIDENCE DOSSIER · {selectedCase.id}
                </span>
                <h2 className="text-base font-bold text-[#E8F0EB]">{selectedCase.title}</h2>
              </div>
              <button
                onClick={() => lab.setEvidenceModalOpen(false)}
                className="text-[#8C9F92] hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field Evidence Side */}
              <div className="rounded border border-[#263A30] bg-[#101F18] p-3 space-y-2">
                <span className="font-mono text-[10px] text-[#55D6A3] uppercase font-bold block">
                  Field Surveillance Evidence
                </span>
                <div className="text-xs font-bold text-[#E8F0EB]">
                  {selectedCase.fieldEvent.sourceName}
                </div>
                <div className="text-[11px] text-[#8C9F92]">
                  {selectedCase.fieldEvent.location} ({selectedCase.fieldEvent.district})
                </div>
                <p className="text-xs text-[#E8F0EB]/90 leading-relaxed bg-[#07110E] p-2.5 rounded border border-[#263A30]">
                  {selectedCase.fieldEvent.details}
                </p>
                <div className="font-mono text-[10px] text-[#55D6A3]">
                  Timestamp: {selectedCase.fieldEvent.timestamp}
                </div>
              </div>

              {/* Online Intelligence Side */}
              <div className="rounded border border-[#263A30] bg-[#101F18] p-3 space-y-2">
                <span className="font-mono text-[10px] text-[#F4A62A] uppercase font-bold block">
                  Cyber Intelligence Evidence
                </span>
                <div className="text-xs font-bold text-[#E8F0EB]">
                  {selectedCase.onlineListing.id} · {selectedCase.onlineListing.platform}
                </div>
                <div className="text-[11px] text-[#8C9F92]">
                  Author: {selectedCase.onlineListing.sourceMetadata.author} · {selectedCase.onlineListing.district}
                </div>
                <p className="text-xs text-[#E8F0EB]/90 leading-relaxed bg-[#07110E] p-2.5 rounded border border-[#263A30]">
                  {selectedCase.onlineListing.title}
                </p>
                <div className="font-mono text-[10px] text-[#F4A62A]">
                  Discovered: {selectedCase.onlineListing.sourceMetadata.discoveredAt}
                </div>
              </div>
            </div>

            {/* Audit Notes */}
            <div className="rounded border border-[#263A30] bg-[#0E1B15] p-3 text-xs space-y-1">
              <span className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">
                Chain of Custody &amp; Analyst Audit Notes
              </span>
              <p className="text-[#8C9F92] leading-relaxed">
                {selectedCase.auditNotes} All simulated data preserved for training and exercise
                compliance.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => lab.setEvidenceModalOpen(false)}
                className="py-1.5 px-4 rounded font-mono text-xs font-bold bg-[#55D6A3] text-black"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Node Info Popover */}
      {activeNodeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setActiveNodeModal(null)}
        >
          <div
            className="w-96 rounded border border-[#55D6A3] bg-[#0B1712] p-4 shadow-xl space-y-2 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#263A30] pb-2 font-mono">
              <span className="text-[#55D6A3] font-bold">NODE TELEMETRY INSPECTION</span>
              <button onClick={() => setActiveNodeModal(null)}>✕</button>
            </div>
            <div className="font-mono text-[#8C9F92]">Node ID: {activeNodeModal}</div>
            <p className="text-[#E8F0EB] leading-relaxed">
              {graphNodes.find((n) => n.id === activeNodeModal)?.details ||
                "Correlated entity in the tactical intelligence network."}
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveNodeModal(null)}
                className="px-3 py-1 rounded bg-[#101F18] border border-[#263A30] text-[#55D6A3]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

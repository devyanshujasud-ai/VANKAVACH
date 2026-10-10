import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Play,
  Zap,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Camera,
  Shield,
  Eye,
  Crosshair,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Volume2,
} from "lucide-react";
import { useDemoLab } from "@/lib/demo-lab-store";
import { ORCHESTRATOR_STAGES, type OrchestratorStage } from "@/lib/demo-lab-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo-lab/orchestrator")({
  head: () => ({
    meta: [
      { title: "Demo Orchestrator Control Center | VANKAVACH DEMO LAB" },
      {
        name: "description",
        content:
          "Cinematic command center running automated multi-stage forest intelligence demonstrations with radar sweep, telemetry streams, and live cross-dashboard orchestration.",
      },
    ],
  }),
  component: DemoOrchestratorDashboard,
});

function DemoOrchestratorDashboard() {
  const lab = useDemoLab();
  const streamEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll live event stream when new events arrive
  useEffect(() => {
    if (streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lab.liveEventStream]);

  // Format elapsed time MM:SS.ms
  const formattedElapsed = useMemo(() => {
    const totalSec = Math.floor(lab.elapsedMs / 1000);
    const minutes = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const seconds = String(totalSec % 60).padStart(2, "0");
    const millis = String(Math.floor((lab.elapsedMs % 1000) / 100));
    return `${minutes}:${seconds}.${millis}`;
  }, [lab.elapsedMs]);

  const activeStage = (ORCHESTRATOR_STAGES[lab.currentStageIndex] || ORCHESTRATOR_STAGES[0])!;
  const progressPercent = Math.round(
    ((lab.currentStageIndex + (lab.orchestratorStatus === "COMPLETED" ? 1 : 0)) /
      ORCHESTRATOR_STAGES.length) *
      100
  );

  return (
    <div className="flex h-full flex-col bg-[#07110E] text-[#E8F0EB] select-none font-sans overflow-hidden">
      {/* Top Banner & Presenter Header Strip */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#263A30] bg-[#0B1712] px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#55D6A3] shadow-[0_0_10px_#55D6A3] anim-pulse" />
            <div className="leading-tight">
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#E8F0EB]">
                VANKAVACH DEMO ORCHESTRATOR
              </div>
              <div className="font-mono text-[9px] text-[#8C9F92]">
                CENTRAL COMMAND &amp; PRESENTATION AUTOMATION CORE
              </div>
            </div>
          </div>

          <span
            className={cn(
              "rounded px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wide border uppercase",
              lab.orchestratorStatus === "RUNNING"
                ? "bg-[#55D6A3]/15 text-[#55D6A3] border-[#55D6A3]/40 anim-pulse"
                : lab.orchestratorStatus === "COMPLETED"
                ? "bg-[#55D6A3] text-[#07110E] border-[#55D6A3]"
                : lab.orchestratorStatus === "PAUSED"
                ? "bg-[#F4A62A]/20 text-[#F4A62A] border-[#F4A62A]/40"
                : "bg-[#263A30]/50 text-[#8C9F92] border-[#263A30]"
            )}
          >
            {lab.orchestratorStatus === "IDLE" ? "● SIMULATION READY" : `● ${lab.orchestratorStatus}`}
          </span>
        </div>

        {/* Presenter Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Start Full Demo (90s) */}
          <button
            onClick={() => lab.startOrchestrator(false)}
            disabled={lab.orchestratorStatus === "RUNNING"}
            className="flex items-center gap-1.5 rounded bg-[#55D6A3] px-3.5 py-1.5 font-mono text-xs font-bold text-[#07110E] hover:bg-[#47c695] transition-all shadow-[0_0_15px_-3px_rgba(85,214,163,0.4)] disabled:opacity-40"
          >
            <Play size={13} fill="currentColor" />
            <span>START FULL DEMO (90s)</span>
          </button>

          {/* Fast Demo (16s) */}
          <button
            onClick={() => lab.startOrchestrator(true)}
            disabled={lab.orchestratorStatus === "RUNNING"}
            className="flex items-center gap-1.5 rounded border border-[#F4A62A] bg-[#F4A62A]/15 px-3 py-1.5 font-mono text-xs font-bold text-[#F4A62A] hover:bg-[#F4A62A]/25 transition-all disabled:opacity-40"
          >
            <Zap size={13} />
            <span>FAST DEMO (16s)</span>
          </button>

          {/* Pause / Resume */}
          {lab.orchestratorStatus === "RUNNING" ? (
            <button
              onClick={lab.pauseOrchestrator}
              className="flex items-center gap-1 rounded border border-[#263A30] bg-[#101F18] px-2.5 py-1.5 font-mono text-xs text-[#8C9F92] hover:text-white"
            >
              <Pause size={13} />
              <span>PAUSE</span>
            </button>
          ) : lab.orchestratorStatus === "PAUSED" ? (
            <button
              onClick={lab.resumeOrchestrator}
              className="flex items-center gap-1 rounded border border-[#55D6A3] bg-[#55D6A3]/10 px-2.5 py-1.5 font-mono text-xs text-[#55D6A3]"
            >
              <Play size={13} />
              <span>RESUME</span>
            </button>
          ) : null}

          {/* Reset */}
          <button
            onClick={lab.resetOrchestrator}
            className="flex items-center gap-1 rounded border border-[#263A30] bg-[#101F18] px-2.5 py-1.5 font-mono text-xs text-[#8C9F92] hover:text-[#E8F0EB] hover:border-[#55D6A3]/40 transition-colors"
          >
            <RotateCcw size={12} />
            <span>RESET</span>
          </button>

          <div className="h-4 w-px bg-[#263A30]" />

          {/* Speed Multiplier */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="text-[10px] text-[#8C9F92]">SPEED:</span>
            {[1, 2, 5].map((mult) => (
              <button
                key={mult}
                onClick={() => lab.setSpeedMultiplier(mult)}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px]",
                  lab.speedMultiplier === mult
                    ? "bg-[#55D6A3] text-black font-bold"
                    : "bg-[#101F18] text-[#8C9F92] border border-[#263A30]"
                )}
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3-Column Command Workspace */}
      <div className="grid flex-1 grid-cols-12 min-h-0 divide-x divide-[#263A30] overflow-hidden">
        {/* ==================================================== */}
        {/* LEFT PANEL: 8 WORKFLOW STAGES (Col 3)                */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0 bg-[#0B1712] overflow-y-auto p-3 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#263A30]">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#8C9F92] uppercase">
              Orchestrator Pipeline (8 Steps)
            </span>
            <span className="font-mono text-[10px] text-[#55D6A3] font-bold">
              {progressPercent}% COMPLETE
            </span>
          </div>

          {/* Workflow Steps List */}
          <div className="space-y-2 flex-1">
            {ORCHESTRATOR_STAGES.map((stage, idx) => {
              const isPast =
                lab.orchestratorStatus === "COMPLETED" || idx < lab.currentStageIndex;
              const isCurrent =
                lab.orchestratorStatus === "RUNNING" && idx === lab.currentStageIndex;
              const isPending =
                lab.orchestratorStatus === "IDLE" || idx > lab.currentStageIndex;

              return (
                <button
                  key={stage.id}
                  onClick={() => lab.jumpToStage(idx)}
                  className={cn(
                    "w-full text-left rounded p-2.5 border transition-all relative group",
                    isCurrent
                      ? "border-[#55D6A3] bg-[#101F18] shadow-[0_0_15px_-4px_rgba(85,214,163,0.3)] ring-1 ring-[#55D6A3]/40"
                      : isPast
                      ? "border-[#263A30] bg-[#0E1B15] opacity-90"
                      : "border-[#263A30]/50 bg-[#07110E] opacity-60 hover:opacity-100"
                  )}
                >
                  {isCurrent && <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#55D6A3]" />}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full flex items-center justify-center font-mono text-[9px] font-bold",
                          isCurrent
                            ? "bg-[#55D6A3] text-black anim-pulse"
                            : isPast
                            ? "bg-[#55D6A3]/20 text-[#55D6A3] border border-[#55D6A3]/40"
                            : "bg-[#263A30] text-[#8C9F92]"
                        )}
                      >
                        {isPast ? "✓" : idx + 1}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold font-mono",
                          isCurrent
                            ? "text-[#55D6A3]"
                            : isPast
                            ? "text-[#E8F0EB]"
                            : "text-[#8C9F92]"
                        )}
                      >
                        {stage.title.replace(/^\d+\.\s*/, "")}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "font-mono text-[9px] uppercase px-1.5 py-0.5 rounded",
                        isCurrent
                          ? "bg-[#55D6A3]/20 text-[#55D6A3] font-bold"
                          : isPast
                          ? "bg-[#263A30] text-[#8C9F92]"
                          : "text-[#8C9F92]/60"
                      )}
                    >
                      {isCurrent ? "ACTIVE" : isPast ? "DONE" : "PENDING"}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[11px] text-[#8C9F92] leading-tight">
                    {stage.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================== */}
        {/* CENTER PANEL: CIRCULAR RADAR VISUALIZATION (Col 5)   */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0 bg-[#07110E] p-3 overflow-hidden">
          {/* Top Telemetry Overlay */}
          <div className="flex items-center justify-between font-mono text-xs text-[#8C9F92] pb-2 border-b border-[#263A30]">
            <div className="flex items-center gap-2">
              <span className="text-[#55D6A3] font-bold">STAGE:</span>
              <span className="text-[#E8F0EB] font-bold">{activeStage.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8C9F92]">ELAPSED:</span>
              <span className="text-[#55D6A3] font-bold text-sm">{formattedElapsed}</span>
            </div>
          </div>

          {/* High-Tech Radar Operational Display */}
          <div className="relative flex-1 rounded border border-[#263A30] bg-[#050C0A] overflow-hidden my-2 flex items-center justify-center shadow-2xl">
            {/* Subtle Grid Matrix Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage:
                  "linear-gradient(#55D6A3 1px, transparent 1px), linear-gradient(90deg, #55D6A3 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* SVG Radar Display */}
            <svg viewBox="0 0 500 500" className="h-[90%] w-[90%] select-none">
              <defs>
                {/* Rotating Sweep Gradient */}
                <radialGradient id="radarSweepGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#55D6A3" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#55D6A3" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="sweepLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#55D6A3" stopOpacity="1" />
                  <stop offset="100%" stopColor="#55D6A3" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Concentric Radar Rings */}
              <circle cx="250" cy="250" r="220" stroke="#263A30" strokeWidth="1" fill="none" />
              <circle cx="250" cy="250" r="165" stroke="#263A30" strokeWidth="1" fill="none" />
              <circle cx="250" cy="250" r="110" stroke="#55D6A3" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4" />
              <circle cx="250" cy="250" r="55" stroke="#263A30" strokeWidth="1" fill="none" />

              {/* Range Markers */}
              <text x="255" y="40" fill="#8C9F92" fontSize="9" fontFamily="monospace">10 KM</text>
              <text x="255" y="95" fill="#8C9F92" fontSize="9" fontFamily="monospace">5 KM</text>
              <text x="255" y="150" fill="#8C9F92" fontSize="9" fontFamily="monospace">2 KM</text>
              <text x="255" y="205" fill="#8C9F92" fontSize="9" fontFamily="monospace">1 KM</text>

              {/* Axis Crosshairs */}
              <line x1="250" y1="20" x2="250" y2="480" stroke="#263A30" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="250" x2="480" y2="250" stroke="#263A30" strokeWidth="1" strokeDasharray="4 4" />

              {/* Angle Diagonal Markers */}
              <line x1="90" y1="90" x2="410" y2="410" stroke="#263A30" strokeWidth="0.5" />
              <line x1="90" y1="410" x2="410" y2="90" stroke="#263A30" strokeWidth="0.5" />

              {/* Rotating Sweep Line */}
              <g className="anim-sweep origin-center">
                <path d="M 250 250 L 250 30 A 220 220 0 0 1 405 95 Z" fill="url(#radarSweepGrad)" />
                <line x1="250" y1="250" x2="250" y2="30" stroke="#55D6A3" strokeWidth="2" />
              </g>

              {/* Sensor Nodes Plotted in Radar Space */}
              {/* CAM-01 (Buffer Western) */}
              <circle cx="150" cy="190" r="5" fill="#55D6A3" />
              <circle cx="150" cy="190" r="10" stroke="#55D6A3" strokeWidth="1" fill="none" opacity="0.5" />
              <text x="120" y="215" fill="#55D6A3" fontSize="9" fontFamily="monospace">CAM-01 (Perimeter)</text>

              {/* CAM-02 (Village Moharli) */}
              <circle cx="340" cy="310" r="5" fill="#55D6A3" />
              <circle cx="340" cy="310" r="10" stroke="#55D6A3" strokeWidth="1" fill="none" opacity="0.5" />
              <text x="320" y="335" fill="#55D6A3" fontSize="9" fontFamily="monospace">CAM-02 (Village)</text>

              {/* CAM-03 (Core Zone Kolsa Ridge) - Highlighted in Alert */}
              <circle
                cx="330"
                cy="140"
                r="7"
                fill={lab.currentStageIndex >= 1 ? "#F05B51" : "#55D6A3"}
                className={lab.currentStageIndex >= 1 ? "anim-pulse" : ""}
              />
              <circle
                cx="330"
                cy="140"
                r="16"
                stroke={lab.currentStageIndex >= 1 ? "#F05B51" : "#55D6A3"}
                strokeWidth="1.5"
                fill="none"
                className="anim-pulse"
              />
              <text
                x="345"
                y="145"
                fill={lab.currentStageIndex >= 1 ? "#F05B51" : "#55D6A3"}
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                CAM-03 [LOCKED]
              </text>

              {/* Acoustic Sensors */}
              <circle cx="210" cy="290" r="4" fill="#55D6A3" />
              <text x="180" y="310" fill="#8C9F92" fontSize="8" fontFamily="monospace">S-04</text>

              <circle cx="260" cy="330" r="4" fill="#55D6A3" />
              <text x="250" y="350" fill="#8C9F92" fontSize="8" fontFamily="monospace">S-07</text>

              {/* Dynamic Connecting Telemetry Line during stage 5/6 */}
              {lab.currentStageIndex >= 4 && (
                <line
                  x1="330"
                  y1="140"
                  x2="210"
                  y2="290"
                  stroke="#F4A62A"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  className="anim-dash"
                />
              )}

              {/* Center Reticle */}
              <circle cx="250" cy="250" r="14" stroke="#55D6A3" strokeWidth="1.5" fill="#0B1712" />
              <circle cx="250" cy="250" r="3" fill="#55D6A3" />
            </svg>

            {/* Floating Live Telemetry Badge over Radar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-[#E8F0EB] bg-black/75 px-3 py-1.5 rounded border border-[#263A30] backdrop-blur-sm">
              <span className="text-[#55D6A3] font-bold">
                RADAR: 3 OPTICAL FEEDS · 12 ACOUSTIC SENSORS ACTIVE
              </span>
              <span className="text-[#8C9F92]">SCANNING CORRIDORS 360°</span>
            </div>
          </div>

          {/* Current Stage Highlight Card */}
          <div className="rounded border border-[#55D6A3]/60 bg-[#101F18] p-3 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#55D6A3] font-bold">CURRENT ACTIVE ORCHESTRATION</span>
              <span className="text-[#8C9F92]">Stage {lab.currentStageIndex + 1} of 8</span>
            </div>
            <div className="text-xs font-bold text-[#E8F0EB]">{activeStage.title}</div>
            <p className="text-[11px] text-[#8C9F92] leading-relaxed">{activeStage.shortDesc}</p>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT PANEL: LIVE STREAMING EVENT LOG (Col 4)        */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-4 flex flex-col min-h-0 bg-[#0B1712] p-3 overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[#263A30]">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#8C9F92] uppercase">
              Live Event Stream
            </span>
            <span className="font-mono text-[9px] text-[#55D6A3] bg-[#55D6A3]/10 px-1.5 py-0.5 rounded border border-[#55D6A3]/30">
              REAL-TIME BUFFER
            </span>
          </div>

          {/* Stream Events Scroll Container */}
          <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 font-mono text-xs">
            {lab.liveEventStream.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-2.5 rounded border transition-colors",
                  item.severity === "CRITICAL"
                    ? "border-[#F05B51]/50 bg-[#F05B51]/10 text-[#F05B51]"
                    : item.severity === "WARNING"
                    ? "border-[#F4A62A]/50 bg-[#F4A62A]/10 text-[#F4A62A]"
                    : item.severity === "SUCCESS"
                    ? "border-[#55D6A3]/50 bg-[#55D6A3]/10 text-[#55D6A3]"
                    : "border-[#263A30] bg-[#101F18] text-[#E8F0EB]"
                )}
              >
                <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                  <span className="font-bold">{item.source}</span>
                  <span>{item.timestamp}</span>
                </div>

                <div className="font-bold text-[11px] tracking-wide mb-0.5">
                  [{item.type}]
                </div>

                <div className="text-[11px] opacity-90 leading-relaxed font-sans">
                  {item.message}
                </div>
              </div>
            ))}
            <div ref={streamEndRef} />
          </div>

          {/* Quick Cross-Dashboard Navigation Links */}
          <div className="pt-2 border-t border-[#263A30] space-y-1.5">
            <span className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold block">
              Inspect Synchronized Dashboards:
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
              <Link
                to="/demo-lab/camera"
                className="py-1 px-1.5 rounded border border-[#263A30] bg-[#101F18] text-center text-[#55D6A3] hover:bg-[#162B21] truncate"
              >
                1. Cameras
              </Link>
              <Link
                to="/demo-lab/cyber-scanner"
                className="py-1 px-1.5 rounded border border-[#263A30] bg-[#101F18] text-center text-[#F4A62A] hover:bg-[#162B21] truncate"
              >
                2. Scanner
              </Link>
              <Link
                to="/demo-lab/linked-cases"
                className="py-1 px-1.5 rounded border border-[#263A30] bg-[#101F18] text-center text-[#55D6A3] hover:bg-[#162B21] truncate"
              >
                3. Cases
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#263A30] border-t border-[#263A30] bg-[#0B1712]">
        <div className="p-2.5 flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#8C9F92]">Optical Detections</div>
          <span className="font-mono text-xs font-bold text-[#E8F0EB]">1 Active Lock</span>
        </div>
        <div className="p-2.5 flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#8C9F92]">Listings Scanned</div>
          <span className="font-mono text-xs font-bold text-[#55D6A3]">1,428 Indexed</span>
        </div>
        <div className="p-2.5 flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#8C9F92]">Correlated Cases</div>
          <span className="font-mono text-xs font-bold text-[#F4A62A]">CASE-2026-TAD-084</span>
        </div>
        <div className="p-2.5 flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#8C9F92]">Pending Review Queue</div>
          <span className="font-mono text-xs font-bold text-[#55D6A3]">Central Desk Notified</span>
        </div>
      </div>
    </div>
  );
}

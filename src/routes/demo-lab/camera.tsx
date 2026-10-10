import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Camera,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Lightbulb,
  Radio,
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Eye,
  SlidersHorizontal,
  Clock,
  Wifi,
  Battery,
  Layers,
  ChevronRight,
  Maximize2,
  Info,
} from "lucide-react";
import { useDemoLab } from "@/lib/demo-lab-store";
import {
  CAMERAS,
  DETECTION_ZONES,
  CLIPS,
  evaluateCameraRule,
  type CameraId,
  type DetectionZone,
  type ClipType,
} from "@/lib/demo-lab-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo-lab/camera")({
  head: () => ({
    meta: [
      { title: "Camera Detection Dashboard | VANKAVACH DEMO LAB" },
      {
        name: "description",
        content:
          "Tactical 3-column Camera Detection Dashboard with optical classification, bounding boxes, rule evaluation, and simulated hardware deterrents.",
      },
    ],
  }),
  component: CameraDetectionDashboard,
});

function CameraDetectionDashboard() {
  const lab = useDemoLab();
  const [liveTimestamp, setLiveTimestamp] = useState("");
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  // Live timer tick for camera feed HUD
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimestamp(
        now.toISOString().slice(0, 10) +
          " " +
          now.toLocaleTimeString("en-GB", { hour12: false }) +
          "." +
          String(now.getMilliseconds()).padStart(3, "0")
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  const activeCam = (CAMERAS.find((c) => c.id === lab.selectedCamera) || CAMERAS[0])!;
  const activeClipData = CLIPS[lab.activeClip];
  const ruleEvaluation = evaluateCameraRule(lab.activeClip, lab.selectedZone);

  return (
    <div className="flex h-full flex-col bg-[#07110E] text-[#E8F0EB] select-none font-sans overflow-hidden">
      {/* Top Banner / Breadcrumb Strip */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#263A30] bg-[#0B1712] px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C9F92]">
            <span className="text-[#55D6A3] font-bold">DEMO LAB</span>
            <span>/</span>
            <span className="text-[#E8F0EB] uppercase tracking-wider font-semibold">Camera Detection Dashboard</span>
          </div>
          <span className="rounded bg-[#55D6A3]/10 border border-[#55D6A3]/30 px-2 py-0.5 font-mono text-[10px] text-[#55D6A3]">
            OPTICAL AI ENGINE ONLINE
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#8C9F92]">
            <Clock size={13} className="text-[#55D6A3]" />
            <span>UTC+05:30</span>
          </div>
          <div className="h-3 w-px bg-[#263A30]" />
          <div className="flex items-center gap-2">
            <span className="text-[#8C9F92]">ACTIVE FEED:</span>
            <span className="text-[#55D6A3] font-bold">{lab.selectedCamera}</span>
          </div>
          <button
            onClick={lab.resetAll}
            className="flex items-center gap-1.5 rounded border border-[#263A30] bg-[#101F18] px-2.5 py-1 text-[11px] text-[#8C9F92] hover:text-[#E8F0EB] hover:border-[#55D6A3]/50 transition-colors"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="grid flex-1 grid-cols-12 min-h-0 divide-x divide-[#263A30] overflow-hidden">
        {/* ==================================================== */}
        {/* LEFT COLUMN: CAMERA SOURCES & ZONE CONTROLS (Col 3)  */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0 bg-[#0B1712] overflow-y-auto">
          {/* Section: Camera Sources */}
          <div className="p-3 border-b border-[#263A30]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#8C9F92] uppercase">
                Camera Sources (3)
              </span>
              <span className="rounded bg-[#55D6A3]/15 px-1.5 py-0.5 font-mono text-[9px] text-[#55D6A3] font-bold">
                ALL ONLINE
              </span>
            </div>

            <div className="space-y-2">
              {CAMERAS.map((cam) => {
                const isSelected = cam.id === lab.selectedCamera;
                return (
                  <button
                    key={cam.id}
                    onClick={() => lab.setCamera(cam.id)}
                    className={cn(
                      "w-full text-left rounded p-2.5 border transition-all relative overflow-hidden group",
                      isSelected
                        ? "border-[#55D6A3] bg-[#101F18] shadow-[0_0_15px_-4px_rgba(85,214,163,0.25)]"
                        : "border-[#263A30] bg-[#0E1B15] hover:border-[#263A30]/80 hover:bg-[#12221A]"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#55D6A3]" />
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          cam.status === "ONLINE" ? "bg-[#55D6A3] shadow-[0_0_8px_#55D6A3]" : "bg-[#8C9F92]"
                        )} />
                        <span className="font-mono text-xs font-bold text-[#E8F0EB]">
                          {cam.id}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#8C9F92] bg-[#07110E] px-1.5 py-0.5 rounded border border-[#263A30]">
                        {cam.resolution}
                      </span>
                    </div>

                    <div className="mt-1 text-xs font-medium text-[#E8F0EB]/90 truncate">
                      {cam.name.replace(/Camera \d+ — /, "")}
                    </div>
                    <div className="text-[10px] text-[#8C9F92] truncate mt-0.5">
                      {cam.location}
                    </div>

                    <div className="mt-2 flex items-center justify-between font-mono text-[9px] text-[#8C9F92] pt-1.5 border-t border-[#263A30]/50">
                      <span className="flex items-center gap-1">
                        <Battery size={11} className="text-[#55D6A3]" />
                        {cam.battery}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Wifi size={11} className="text-[#55D6A3]" />
                        {cam.signalStrength} dBm
                      </span>
                      <span className="text-[#55D6A3]">{cam.fps} FPS</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Detection Zone Selector */}
          <div className="p-3 border-b border-[#263A30] bg-[#0E1B15]/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#8C9F92] uppercase">
                Active Detection Zone
              </span>
              <Layers size={13} className="text-[#55D6A3]" />
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {DETECTION_ZONES.map((zone) => {
                const isSelected = zone === lab.selectedZone;
                return (
                  <button
                    key={zone}
                    onClick={() => lab.setZone(zone)}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors border text-left",
                      isSelected
                        ? "border-[#55D6A3] bg-[#55D6A3]/10 text-[#55D6A3] font-semibold"
                        : "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB] hover:bg-[#162A20]"
                    )}
                  >
                    <span>{zone}</span>
                    {isSelected ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#55D6A3] shadow-[0_0_6px_#55D6A3]" />
                    ) : (
                      <span className="text-[10px] font-mono text-[#8C9F92]/60">Select</span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-[#8C9F92] leading-relaxed">
              Rules adapt dynamically when switching zones. Core Zone escalates person detections to critical priority.
            </p>
          </div>

          {/* Section: Recent Event Logs */}
          <div className="p-3 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#8C9F92] uppercase">
                Recent Camera Events
              </span>
              <span className="font-mono text-[9px] text-[#8C9F92]">
                {lab.detectionHistory.length} LOGGED
              </span>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
              {lab.detectionHistory.map((ev, i) => (
                <div
                  key={`${ev.id}-${i}`}
                  className="rounded border border-[#263A30] bg-[#101F18] p-2 text-xs hover:border-[#55D6A3]/40 transition-colors"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#55D6A3] font-bold">{ev.cameraId}</span>
                    <span className="text-[#8C9F92]">{ev.timestamp}</span>
                  </div>
                  <div className="mt-1 font-semibold text-[#E8F0EB] truncate">
                    {ev.detectedClass}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-[#8C9F92]">{ev.zone}</span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase",
                        ev.alertLevel === "CRITICAL"
                          ? "bg-[#F05B51]/20 text-[#F05B51] border border-[#F05B51]/40"
                          : ev.alertLevel === "HIGH"
                          ? "bg-[#F4A62A]/20 text-[#F4A62A] border border-[#F4A62A]/40"
                          : ev.alertLevel === "WARNING"
                          ? "bg-[#F4A62A]/15 text-[#F4A62A]"
                          : "bg-[#55D6A3]/15 text-[#55D6A3]"
                      )}
                    >
                      {ev.alertLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* CENTER COLUMN: LIVE CAMERA PREVIEW PANEL (Col 6)     */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-6 flex flex-col min-h-0 bg-[#07110E] p-3 overflow-y-auto">
          {/* Camera Feed Container */}
          <div className="relative flex-1 rounded border border-[#263A30] bg-black overflow-hidden flex flex-col min-h-[420px] shadow-2xl">
            {/* Top Feed Overlay Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded bg-red-600/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white anim-pulse" />
                  LIVE REC
                </span>
                <span className="text-[#E8F0EB] font-bold tracking-wide">
                  {activeCam.id} · {activeCam.name.replace(/Camera \d+ — /, "")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded border border-[#F4A62A]/40 bg-[#F4A62A]/10 px-2 py-0.5 text-[10px] font-bold text-[#F4A62A]">
                  SIMULATION MODE
                </span>
                <button
                  onClick={() => setFullscreenPreview(!fullscreenPreview)}
                  className="rounded p-1 text-[#8C9F92] hover:text-white transition-colors"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            {/* Simulated High-Tech Camera Canvas / Scene */}
            <div className="relative flex-1 w-full bg-[#050C0A] flex items-center justify-center overflow-hidden">
              {/* Scanlines Effect */}
              <div className="absolute inset-0 pointer-events-none vk-scanlines z-10 opacity-60" />

              {/* Grid Lines */}
              <div
                className="absolute inset-0 pointer-events-none z-0 opacity-15"
                style={{
                  backgroundImage:
                    "linear-gradient(#55D6A3 1px, transparent 1px), linear-gradient(90deg, #55D6A3 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />

              {/* Hardware Deterrent Visual Effects */}
              {lab.strobeActive && (
                <div className="absolute inset-0 z-30 pointer-events-none bg-white/40 anim-pulse transition-opacity" />
              )}
              {lab.speakerActive && (
                <div className="absolute inset-0 z-30 pointer-events-none border-4 border-[#F05B51] anim-pulse" />
              )}

              {/* Real Night Vision Camera Trap Photo Feed */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={activeClipData.imageSrc}
                  alt={activeClipData.detectedClass}
                  className="h-full w-full object-cover filter brightness-[0.88] contrast-[1.12]"
                />
                {/* Night-Vision Surveillance Tint Overlay */}
                <div className="absolute inset-0 bg-[#071C13]/25 mix-blend-color pointer-events-none" />
                {/* Surveillance Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />
              </div>

              {/* Simulated Detection Bounding Box */}
              {lab.isDetecting && (
                <div
                  className={cn(
                    "absolute z-20 transition-all duration-300 pointer-events-none border-2",
                    ruleEvaluation.alertLevel === "CRITICAL"
                      ? "border-[#F05B51] shadow-[0_0_20px_rgba(240,91,81,0.5)]"
                      : ruleEvaluation.alertLevel === "HIGH"
                      ? "border-[#F4A62A] shadow-[0_0_20px_rgba(244,166,42,0.4)]"
                      : "border-[#55D6A3] shadow-[0_0_20px_rgba(85,214,163,0.4)]"
                  )}
                  style={{
                    left: `${activeClipData.box.x}%`,
                    top: `${activeClipData.box.y}%`,
                    width: `${activeClipData.box.w}%`,
                    height: `${activeClipData.box.h}%`,
                  }}
                >
                  {/* Glowing Reticle Corner Brackets */}
                  <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-white" />

                  {/* Top Floating Badge on Bounding Box */}
                  <div
                    className={cn(
                      "absolute -top-7 left-0 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide flex items-center gap-1.5 shadow-md",
                      ruleEvaluation.alertLevel === "CRITICAL"
                        ? "bg-[#F05B51] text-white"
                        : ruleEvaluation.alertLevel === "HIGH"
                        ? "bg-[#F4A62A] text-black"
                        : "bg-[#55D6A3] text-black"
                    )}
                  >
                    <Crosshair size={10} />
                    <span>{activeClipData.detectedClass}</span>
                    <span className="opacity-90">[{activeClipData.confidence}%]</span>
                  </div>

                  {/* Bottom Telemetry on Bounding Box */}
                  <div className="absolute -bottom-6 left-0 whitespace-nowrap font-mono text-[9px] text-[#E8F0EB] bg-black/80 px-1.5 py-0.5 rounded border border-[#263A30]">
                    {activeClipData.telemetry.split(" · ")[0]}
                  </div>
                </div>
              )}

              {/* Bottom HUD Telemetry Strip */}
              <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between font-mono text-[10px] text-[#55D6A3] bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-[#263A30]/80">
                <div className="flex items-center gap-3">
                  <span>FPS: {activeCam.fps}.0</span>
                  <span>BITRATE: 4.8 Mbps</span>
                  <span>IR: {activeCam.irEnabled ? "ACTIVE (850nm)" : "OFF"}</span>
                </div>
                <div className="text-right text-[#E8F0EB] font-bold">
                  {liveTimestamp || "2026-10-10 20:18:12.441"}
                </div>
              </div>
            </div>

            {/* Simulated Camera Video Timeline & Scrubber */}
            <div className="border-t border-[#263A30] bg-[#0B1712] p-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-[#8C9F92] mb-1.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => lab.toggleCamera()}
                    className="p-1 rounded hover:bg-[#101F18] text-[#55D6A3] transition-colors"
                  >
                    {lab.isCameraRunning ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <span className="text-[#E8F0EB] font-bold">00:18:12</span>
                  <span>/</span>
                  <span>01:00:00</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px]">SPEED:</span>
                  <button
                    onClick={() => lab.setPlaybackSpeed(1)}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px]",
                      lab.playbackSpeed === 1 ? "bg-[#55D6A3] text-black font-bold" : "bg-[#101F18] text-[#8C9F92]"
                    )}
                  >
                    1X
                  </button>
                  <button
                    onClick={() => lab.setPlaybackSpeed(2)}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px]",
                      lab.playbackSpeed === 2 ? "bg-[#55D6A3] text-black font-bold" : "bg-[#101F18] text-[#8C9F92]"
                    )}
                  >
                    2X
                  </button>
                </div>
              </div>

              {/* Progress Slider Track with Marker Ticks */}
              <div className="relative w-full">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lab.timelinePosition}
                  onChange={(e) => lab.setTimelinePosition(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#162A20] rounded-lg appearance-none cursor-pointer accent-[#55D6A3]"
                />
                {/* Event Markers on Timeline */}
                <div className="absolute top-0 left-[24%] h-1.5 w-1 bg-[#F4A62A] rounded-full pointer-events-none" title="Vehicle Event" />
                <div className="absolute top-0 left-[55%] h-1.5 w-1 bg-[#55D6A3] rounded-full pointer-events-none" title="Animal Event" />
                <div className="absolute top-0 left-[72%] h-1.5 w-1.5 bg-[#F05B51] rounded-full pointer-events-none ring-2 ring-[#F05B51]/40" title="Intruder Event" />
              </div>
            </div>
          </div>

          {/* Controls Strip: Clip Selectors & Action Buttons */}
          <div className="mt-3 grid grid-cols-12 gap-2">
            {/* Clip Selector Buttons */}
            <div className="col-span-12 md:col-span-7 flex items-center gap-2 p-2 rounded border border-[#263A30] bg-[#0B1712]">
              <span className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold mr-1">
                Clips:
              </span>
              {(["person", "animal", "vehicle"] as ClipType[]).map((clip) => {
                const isSelected = lab.activeClip === clip;
                return (
                  <button
                    key={clip}
                    onClick={() => lab.selectClip(clip)}
                    className={cn(
                      "flex-1 py-1.5 px-2 rounded text-xs font-mono font-medium transition-all text-center border capitalize",
                      isSelected
                        ? "border-[#55D6A3] bg-[#55D6A3]/15 text-[#55D6A3] font-bold shadow-[0_0_10px_-2px_rgba(85,214,163,0.3)]"
                        : "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB] hover:bg-[#162B21]"
                    )}
                  >
                    {clip} Clip
                  </button>
                );
              })}
            </div>

            {/* Trigger & Start/Stop Controls */}
            <div className="col-span-12 md:col-span-5 flex items-center gap-2">
              <button
                onClick={() => lab.toggleCamera()}
                className={cn(
                  "flex-1 py-2 px-2.5 rounded font-mono text-xs font-bold border transition-colors flex items-center justify-center gap-1.5",
                  lab.isCameraRunning
                    ? "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB]"
                    : "border-[#55D6A3] bg-[#55D6A3]/10 text-[#55D6A3]"
                )}
              >
                {lab.isCameraRunning ? <Pause size={13} /> : <Play size={13} />}
                {lab.isCameraRunning ? "STOP CAMERA" : "START CAMERA"}
              </button>

              <button
                onClick={lab.triggerDetection}
                className="flex-1 py-2 px-2.5 rounded font-mono text-xs font-bold bg-[#55D6A3] text-[#07110E] hover:bg-[#48be8f] transition-all shadow-[0_0_15px_-3px_rgba(85,214,163,0.4)] flex items-center justify-center gap-1.5"
              >
                <Crosshair size={13} />
                TRIGGER DETECT
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: DETECTION ANALYSIS & HARDWARE (Col 3)  */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0 bg-[#0B1712] p-3 overflow-y-auto space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#263A30]">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#8C9F92] uppercase">
              Detection Analysis
            </span>
            <span className="font-mono text-[9px] text-[#55D6A3] bg-[#55D6A3]/10 px-1.5 py-0.5 rounded border border-[#55D6A3]/30">
              YOLO-V11-TATR
            </span>
          </div>

          {/* Detected Object Card */}
          <div className="rounded border border-[#263A30] bg-[#101F18] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8C9F92] uppercase">Detected Object</span>
              <span className="font-mono text-xs font-bold text-[#55D6A3]">
                {activeClipData.confidence}% CONFIDENCE
              </span>
            </div>

            <div className="text-sm font-bold text-[#E8F0EB]">
              {activeClipData.detectedClass}
            </div>

            {/* Confidence Bar Meter */}
            <div className="w-full bg-[#162A20] h-2 rounded-full overflow-hidden border border-[#263A30]">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  ruleEvaluation.alertLevel === "CRITICAL"
                    ? "bg-[#F05B51]"
                    : ruleEvaluation.alertLevel === "HIGH"
                    ? "bg-[#F4A62A]"
                    : "bg-[#55D6A3]"
                )}
                style={{ width: `${activeClipData.confidence}%` }}
              />
            </div>

            <p className="text-[11px] text-[#8C9F92] leading-relaxed pt-1">
              {activeClipData.telemetry}
            </p>
          </div>

          {/* Triggered Rule Card */}
          <div
            className={cn(
              "rounded border p-3 space-y-2 transition-all",
              ruleEvaluation.alertLevel === "CRITICAL"
                ? "border-[#F05B51]/60 bg-[#F05B51]/10"
                : ruleEvaluation.alertLevel === "HIGH"
                ? "border-[#F4A62A]/60 bg-[#F4A62A]/10"
                : "border-[#55D6A3]/40 bg-[#55D6A3]/5"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C9F92]">
                Triggered Rule
              </span>
              <span
                className={cn(
                  "rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase",
                  ruleEvaluation.alertLevel === "CRITICAL"
                    ? "bg-[#F05B51] text-white"
                    : ruleEvaluation.alertLevel === "HIGH"
                    ? "bg-[#F4A62A] text-black"
                    : "bg-[#55D6A3] text-black"
                )}
              >
                {ruleEvaluation.alertLevel}
              </span>
            </div>

            <div className="font-mono text-xs font-bold text-[#E8F0EB]">
              {ruleEvaluation.ruleCode}
            </div>

            <p className="text-[11px] text-[#E8F0EB]/90 leading-relaxed">
              {ruleEvaluation.explanation}
            </p>
          </div>

          {/* Resulting Action Card */}
          <div className="rounded border border-[#263A30] bg-[#101F18] p-3 space-y-1.5">
            <span className="text-[10px] font-mono text-[#8C9F92] uppercase font-bold">
              Resulting Tactical Action
            </span>
            <p className="text-xs text-[#55D6A3] font-medium leading-relaxed">
              {ruleEvaluation.action}
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#8C9F92]">
              <CheckCircle2 size={12} className="text-[#55D6A3]" />
              <span>Status: Dispatched &amp; Logged to Central Queue</span>
            </div>
          </div>

          {/* Simulated Hardware Controls (LED Spotlight & Speaker) */}
          <div className="rounded border border-[#263A30] bg-[#0E1B15] p-3 space-y-2.5">
            <span className="text-[10px] font-mono text-[#8C9F92] uppercase font-bold block">
              Simulated Hardware Deterrents
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={lab.toggleStrobe}
                className={cn(
                  "p-2.5 rounded border text-xs font-mono font-medium flex flex-col items-center gap-1.5 transition-all text-center",
                  lab.strobeActive
                    ? "border-yellow-400 bg-yellow-400/20 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.4)]"
                    : "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB] hover:bg-[#162A20]"
                )}
              >
                <Lightbulb size={16} className={lab.strobeActive ? "text-yellow-300" : ""} />
                <span>LED STROBE</span>
                <span className="text-[9px] opacity-75">{lab.strobeActive ? "PULSING" : "STANDBY"}</span>
              </button>

              <button
                onClick={lab.triggerSpeaker}
                className={cn(
                  "p-2.5 rounded border text-xs font-mono font-medium flex flex-col items-center gap-1.5 transition-all text-center",
                  lab.speakerActive
                    ? "border-[#F05B51] bg-[#F05B51]/20 text-[#F05B51] shadow-[0_0_12px_rgba(240,91,81,0.4)] anim-pulse"
                    : "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB] hover:bg-[#162A20]"
                )}
              >
                <Volume2 size={16} className={lab.speakerActive ? "text-[#F05B51]" : ""} />
                <span>BIO-ACOUSTIC</span>
                <span className="text-[9px] opacity-75">{lab.speakerActive ? "FIRING 125dB" : "ARMED"}</span>
              </button>
            </div>
          </div>

          {/* Quick Explanatory Rules Cheat-Sheet */}
          <div className="rounded border border-[#263A30]/60 bg-[#07110E] p-2.5 text-[10px] text-[#8C9F92] space-y-1 font-mono">
            <div className="text-[#55D6A3] font-bold">RULES LOGIC REFERENCE:</div>
            <div>• Person + Core = Critical Alarm</div>
            <div>• Vehicle + No-Vehicle = Unauthorized Vehicle</div>
            <div>• Animal + Village = Conflict Mitigation</div>
            <div>• Animal + Deep Forest = Census Observation</div>
          </div>
        </div>
      </div>
    </div>
  );
}

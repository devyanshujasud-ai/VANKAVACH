import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  CAMERAS,
  DETECTION_ZONES,
  CLIPS,
  CAMERA_RULES,
  evaluateCameraRule,
  INITIAL_CAMERA_LOGS,
  MOCK_CYBER_LISTINGS,
  INITIAL_FIELD_ALERTS,
  INITIAL_LINKED_CASES,
  ORCHESTRATOR_STAGES,
  type CameraId,
  type DetectionZone,
  type ClipType,
  type CameraEventLog,
  type CyberListing,
  type ListingDistrict,
  type ListingLanguage,
  type ListingClassification,
  type FieldAlert,
  type LinkedCase,
  type OrchestratorStage,
} from "./demo-lab-data";
import { useVk } from "./vk-store";

export interface DemoLabStreamEvent {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  severity: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
  message: string;
}

interface DemoLabState {
  // Camera Dashboard
  selectedCamera: CameraId;
  selectedZone: DetectionZone;
  activeClip: ClipType;
  isCameraRunning: boolean;
  isDetecting: boolean;
  detectionHistory: CameraEventLog[];
  strobeActive: boolean;
  speakerActive: boolean;
  playbackSpeed: 1 | 2;
  timelinePosition: number;

  // Cyber Wildlife-Trade Scanner
  listings: CyberListing[];
  selectedListingId: string | null;
  searchQuery: string;
  districtFilter: ListingDistrict | "ALL";
  languageFilter: ListingLanguage | "ALL";
  riskFilter: "ALL" | "HIGH" | "MEDIUM" | "LOW";
  classificationFilter: ListingClassification | "ALL";
  isScanning: boolean;
  scanProgress: number;
  crawlerInterval: number;
  keywordSensitivity: number;
  deepAnalysisMode: boolean;

  // Linked Case Investigation
  fieldAlerts: FieldAlert[];
  linkedCases: LinkedCase[];
  selectedCaseId: string | null;
  selectedFieldAlertId: string | null;
  evidenceModalOpen: boolean;
  caseFilter: "ALL" | "PENDING_REVIEW" | "REVIEWED" | "ESCALATED";

  // Demo Orchestrator
  orchestratorStatus: "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED";
  currentStageIndex: number;
  isFastMode: boolean;
  speedMultiplier: number;
  elapsedMs: number;
  liveEventStream: DemoLabStreamEvent[];
}

const INITIAL_STREAM_EVENTS: DemoLabStreamEvent[] = [
  {
    id: "STR-001",
    timestamp: "20:10:00",
    type: "SYSTEM_READY",
    source: "CORE_ORCHESTRATOR",
    severity: "INFO",
    message: "Simulation engines loaded. 4 command modules active.",
  },
  {
    id: "STR-002",
    timestamp: "20:14:36",
    type: "ACOUSTIC_EVENT",
    source: "SENSOR_MESH",
    severity: "WARNING",
    message: "Acoustic anomaly triangulated at Sector 4 border ridge (EV-2042).",
  },
];

interface DemoLabContextType extends DemoLabState {
  // Camera Actions
  setCamera: (id: CameraId) => void;
  setZone: (zone: DetectionZone) => void;
  selectClip: (clip: ClipType) => void;
  toggleCamera: (running?: boolean) => void;
  triggerDetection: () => void;
  toggleStrobe: () => void;
  triggerSpeaker: () => void;
  setPlaybackSpeed: (speed: 1 | 2) => void;
  setTimelinePosition: (pos: number) => void;

  // Cyber Scanner Actions
  selectListing: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setDistrictFilter: (d: ListingDistrict | "ALL") => void;
  setLanguageFilter: (l: ListingLanguage | "ALL") => void;
  setRiskFilter: (r: "ALL" | "HIGH" | "MEDIUM" | "LOW") => void;
  setClassificationFilter: (c: ListingClassification | "ALL") => void;
  setCrawlerInterval: (interval: number) => void;
  setKeywordSensitivity: (sens: number) => void;
  setDeepAnalysisMode: (deep: boolean) => void;
  runCyberScan: () => void;
  markListingForReview: (id: string) => void;
  dismissListing: (id: string) => void;
  linkListingToIncident: (listingId: string, fieldAlertId?: string) => void;

  // Linked Case Actions
  selectCase: (id: string | null) => void;
  selectFieldAlert: (id: string | null) => void;
  setEvidenceModalOpen: (open: boolean) => void;
  setCaseFilter: (filter: "ALL" | "PENDING_REVIEW" | "REVIEWED" | "ESCALATED") => void;
  submitCaseForReview: (id: string) => void;
  markCaseReviewed: (id: string) => void;
  escalateCase: (id: string) => void;
  createManualCase: (fieldAlertId: string, listingId: string) => void;

  // Demo Orchestrator Actions
  startOrchestrator: (fast?: boolean) => void;
  pauseOrchestrator: () => void;
  resumeOrchestrator: () => void;
  resetOrchestrator: () => void;
  setSpeedMultiplier: (mult: number) => void;
  jumpToStage: (stageIndex: number) => void;

  // Reset Everything
  resetAll: () => void;
}

const DemoLabContext = createContext<DemoLabContextType | null>(null);

export function DemoLabProvider({ children }: { children: ReactNode }) {
  const vk = useVk();

  // Camera State
  const [selectedCamera, setSelectedCamera] = useState<CameraId>("CAM-03");
  const [selectedZone, setSelectedZone] = useState<DetectionZone>("Core Zone");
  const [activeClip, setActiveClip] = useState<ClipType>("person");
  const [isCameraRunning, setIsCameraRunning] = useState(true);
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectionHistory, setDetectionHistory] = useState<CameraEventLog[]>(INITIAL_CAMERA_LOGS);
  const [strobeActive, setStrobeActive] = useState(false);
  const [speakerActive, setSpeakerActive] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [timelinePosition, setTimelinePosition] = useState(72);

  // Cyber Scanner State
  const [listings, setListings] = useState<CyberListing[]>(MOCK_CYBER_LISTINGS);
  const [selectedListingId, setSelectedListingId] = useState<string | null>("LIST-901");
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState<ListingDistrict | "ALL">("ALL");
  const [languageFilter, setLanguageFilter] = useState<ListingLanguage | "ALL">("ALL");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const [classificationFilter, setClassificationFilter] = useState<ListingClassification | "ALL">("ALL");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [crawlerInterval, setCrawlerInterval] = useState(15);
  const [keywordSensitivity, setKeywordSensitivity] = useState(85);
  const [deepAnalysisMode, setDeepAnalysisMode] = useState(true);

  // Linked Case State
  const [fieldAlerts, setFieldAlerts] = useState<FieldAlert[]>(INITIAL_FIELD_ALERTS);
  const [linkedCases, setLinkedCases] = useState<LinkedCase[]>(INITIAL_LINKED_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>("CASE-2026-TAD-084");
  const [selectedFieldAlertId, setSelectedFieldAlertId] = useState<string | null>("CAM-EV-108");
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [caseFilter, setCaseFilter] = useState<"ALL" | "PENDING_REVIEW" | "REVIEWED" | "ESCALATED">("ALL");

  // Orchestrator State
  const [orchestratorStatus, setOrchestratorStatus] = useState<"IDLE" | "RUNNING" | "PAUSED" | "COMPLETED">("IDLE");
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isFastMode, setIsFastMode] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [liveEventStream, setLiveEventStream] = useState<DemoLabStreamEvent[]>(INITIAL_STREAM_EVENTS);

  // Timer Ref for Orchestrator
  const orchestratorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add Stream Event Helper
  const addStreamEvent = useCallback((event: Omit<DemoLabStreamEvent, "id">) => {
    const newEv: DemoLabStreamEvent = {
      id: `STR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...event,
    };
    setLiveEventStream((prev) => [newEv, ...prev.slice(0, 49)]);
  }, []);

  // Camera Actions
  const setCamera = useCallback((id: CameraId) => {
    setSelectedCamera(id);
    const cam = CAMERAS.find((c) => c.id === id);
    if (cam) {
      setSelectedZone(cam.defaultZone);
    }
  }, []);

  const setZone = useCallback((zone: DetectionZone) => {
    setSelectedZone(zone);
    const evalResult = evaluateCameraRule(activeClip, zone);
    toast(`Zone updated: ${zone}`, {
      description: `Active Rule: ${evalResult.ruleCode} (${evalResult.alertLevel})`,
    });
  }, [activeClip]);

  const selectClip = useCallback((clip: ClipType) => {
    setActiveClip(clip);
    setIsDetecting(true);
    const clipData = CLIPS[clip];
    const evalResult = evaluateCameraRule(clip, selectedZone);

    // Create log entry
    const newLog: CameraEventLog = {
      id: `CAM-EV-${Math.floor(100 + Math.random() * 900)}`,
      cameraId: selectedCamera,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      clipType: clip,
      detectedClass: clipData.detectedClass,
      confidence: clipData.confidence,
      zone: selectedZone,
      alertLevel: evalResult.alertLevel,
      actionTaken: evalResult.action,
    };

    setDetectionHistory((prev) => [newLog, ...prev.slice(0, 24)]);
    addStreamEvent({
      timestamp: newLog.timestamp,
      type: "OPTICAL_DETECT",
      source: selectedCamera,
      severity: evalResult.alertLevel === "CRITICAL" ? "CRITICAL" : evalResult.alertLevel === "HIGH" ? "WARNING" : "INFO",
      message: `${clipData.detectedClass} (${clipData.confidence}%) detected in ${selectedZone}.`,
    });

    toast.info(`Simulated Clip Loaded: ${clipData.label}`, {
      description: `${clipData.detectedClass} · ${evalResult.ruleCode}`,
    });
  }, [selectedCamera, selectedZone, addStreamEvent]);

  const toggleCamera = useCallback((running?: boolean) => {
    setIsCameraRunning((prev) => (running !== undefined ? running : !prev));
  }, []);

  const triggerDetection = useCallback(() => {
    selectClip(activeClip);
    toast.success("Detection Re-analyzed", {
      description: `Target bounding box refreshed with active AI model.`,
    });
  }, [activeClip, selectClip]);

  const toggleStrobe = useCallback(() => {
    setStrobeActive((prev) => {
      const next = !prev;
      if (next) {
        toast.warning("Simulated LED Strobe Activated", {
          description: `Directional 12,000-lumen deterrent beacon pulsing on ${selectedCamera}.`,
        });
        addStreamEvent({
          timestamp: new Date().toLocaleTimeString(),
          type: "HARDWARE_STROBE",
          source: selectedCamera,
          severity: "WARNING",
          message: `Deterrent strobe triggered on ${selectedCamera}.`,
        });
      } else {
        toast("Simulated Strobe Standby");
      }
      return next;
    });
  }, [selectedCamera, addStreamEvent]);

  const triggerSpeaker = useCallback(() => {
    setSpeakerActive(true);
    toast.error("Simulated Ultrasonic Acoustic Siren Triggered", {
      description: "Emitting high-frequency bio-acoustic repellent signal.",
    });
    addStreamEvent({
      timestamp: new Date().toLocaleTimeString(),
      type: "HARDWARE_ACOUSTIC",
      source: selectedCamera,
      severity: "CRITICAL",
      message: `Acoustic repellent siren dispatched on ${selectedCamera}.`,
    });
    setTimeout(() => {
      setSpeakerActive(false);
    }, 4000);
  }, [selectedCamera, addStreamEvent]);

  // Cyber Scanner Actions
  const selectListing = useCallback((id: string | null) => {
    setSelectedListingId(id);
  }, []);

  const runCyberScan = useCallback(() => {
    setIsScanning(true);
    setScanProgress(0);
    toast.info("Cyber Crawler Initiated", {
      description: "Scanning Telegram channels, classifieds forums & dark social mirrors...",
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        toast.success("Scan Complete: 1,428 Listings Indexed", {
          description: "4 High-Risk Leads Flagged for Wildlife Protection Compliance.",
        });
        addStreamEvent({
          timestamp: new Date().toLocaleTimeString(),
          type: "CRAWLER_COMPLETE",
          source: "CYBER_SCANNER",
          severity: "SUCCESS",
          message: "Crawler sweep completed. 20 target mock listings categorized.",
        });
      } else {
        setScanProgress(current);
      }
    }, 250);
  }, [addStreamEvent]);

  const markListingForReview = useCallback((id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reviewStatus: "PENDING_REVIEW" } : item))
    );
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      vk.set({
        review: [
          {
            id: listing.id,
            title: `Cyber Lead: ${listing.title.slice(0, 32)}...`,
            kind: "Cyber Intel",
            status: "PENDING",
            time: new Date().toLocaleTimeString().slice(0, 5),
          },
          ...vk.review.filter((r) => r.id !== listing.id),
        ],
      });
      addStreamEvent({
        timestamp: new Date().toLocaleTimeString(),
        type: "LEAD_ENQUEUED",
        source: "CYBER_SCANNER",
        severity: "WARNING",
        message: `${listing.id} submitted for human intelligence review.`,
      });
      toast.success(`${listing.id} Submitted for Human Review`, {
        description: `Added to Central Duty Desk review queue.`,
      });
    }
  }, [listings, vk, addStreamEvent]);

  const dismissListing = useCallback((id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reviewStatus: "DISMISSED" } : item))
    );
    toast.info(`${id} Dismissed as Non-Actionable`, {
      description: "Tagged as false positive or legitimate activity in archive.",
    });
  }, []);

  const linkListingToIncident = useCallback((listingId: string, alertId?: string) => {
    const listing = listings.find((l) => l.id === listingId);
    const targetAlert = fieldAlerts.find((f) => (alertId ? f.id === alertId : true)) || fieldAlerts[0];

    if (!listing || !targetAlert) return;

    const newCaseId = `CASE-2026-TAD-${Math.floor(100 + Math.random() * 900)}`;
    const newCase: LinkedCase = {
      id: newCaseId,
      title: `Correlated ${targetAlert.detectedClass} ↔ ${listing.title.slice(0, 24)}...`,
      fieldEventId: targetAlert.id,
      fieldEvent: targetAlert,
      onlineListingId: listing.id,
      onlineListing: listing,
      districtMatch: targetAlert.district === listing.district,
      dateDifferenceDays: 1.2,
      correlationReasons: [
        `District Concurrence: Both detected within ${listing.district} administrative jurisdiction.`,
        `Temporal Proximity: Online posting occurred within 36 hours of sensor disruption.`,
        `Modus Operandi: Target species (${listing.species}) matches field intrusion profile.`,
      ],
      correlationScore: 88.4,
      reviewStatus: "PENDING_REVIEW",
      auditNotes: "Correlated via Cyber Wildlife-Trade Scanner linking tool.",
    };

    setLinkedCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newCaseId);

    // Update global review queue
    vk.set({
      review: [
        {
          id: newCaseId,
          title: `Linked Case: ${newCase.title.slice(0, 32)}`,
          kind: "Linked Case",
          status: "PENDING",
          time: new Date().toLocaleTimeString().slice(0, 5),
        },
        ...vk.review,
      ],
    });

    addStreamEvent({
      timestamp: new Date().toLocaleTimeString(),
      type: "CASE_LINKED",
      source: "CORRELATION_ENGINE",
      severity: "CRITICAL",
      message: `Created ${newCaseId} linking ${targetAlert.id} to ${listing.id}.`,
    });

    toast.success(`Linked Case Created: ${newCaseId}`, {
      description: "Correlated spatiotemporal profile. Forwarded to Investigation Workspace.",
    });
  }, [listings, fieldAlerts, vk, addStreamEvent]);

  // Linked Case Actions
  const selectCase = useCallback((id: string | null) => {
    setSelectedCaseId(id);
    if (id) {
      const c = linkedCases.find((item) => item.id === id);
      if (c) {
        setSelectedFieldAlertId(c.fieldEventId);
      }
    }
  }, [linkedCases]);

  const selectFieldAlert = useCallback((id: string | null) => {
    setSelectedFieldAlertId(id);
  }, []);

  const submitCaseForReview = useCallback((id: string) => {
    setLinkedCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reviewStatus: "PENDING_REVIEW" } : c))
    );
    vk.set({
      review: [
        {
          id,
          title: `Investigation Case ${id}`,
          kind: "Linked Case",
          status: "PENDING",
          time: new Date().toLocaleTimeString().slice(0, 5),
        },
        ...vk.review.filter((r) => r.id !== id),
      ],
    });
    toast.success(`Case ${id} Submitted for Human Review`, {
      description: "Duty Analyst Mehta notified.",
    });
  }, [vk]);

  const markCaseReviewed = useCallback((id: string) => {
    setLinkedCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reviewStatus: "REVIEWED" } : c))
    );
    vk.set({
      review: vk.review.map((r) => (r.id === id ? { ...r, status: "REVIEWED" } : r)),
    });
    toast.success(`Case ${id} Marked as Reviewed`, {
      description: "Logged to Permanent Tactical Incident Registry.",
    });
  }, [vk]);

  const escalateCase = useCallback((id: string) => {
    setLinkedCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reviewStatus: "ESCALATED" } : c))
    );
    toast.error(`Case ${id} Escalated to Field Taskforce`, {
      description: "Transmitted to Chandrapur Chief Conservator of Forests (CCF).",
    });
  }, []);

  const createManualCase = useCallback((fieldAlertId: string, listingId: string) => {
    linkListingToIncident(listingId, fieldAlertId);
  }, [linkListingToIncident]);

  // Demo Orchestrator Cleanups
  const clearOrchestratorTimers = useCallback(() => {
    if (orchestratorTimerRef.current) {
      clearTimeout(orchestratorTimerRef.current);
      orchestratorTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  // Orchestrator State Machine Execution
  const executeStage = useCallback((stageIndex: number, fast: boolean, multiplier: number) => {
    if (stageIndex >= ORCHESTRATOR_STAGES.length) {
      setOrchestratorStatus("COMPLETED");
      clearOrchestratorTimers();
      toast.success("DEMO ORCHESTRATION COMPLETED!", {
        description: "All 8 stages executed successfully. System state synchronized.",
      });
      return;
    }

    setCurrentStageIndex(stageIndex);
    const stage = ORCHESTRATOR_STAGES[stageIndex];
    if (!stage) return;

    // Emit stage event
    if (stage.eventToEmit) {
      addStreamEvent({
        timestamp: new Date().toLocaleTimeString(),
        type: stage.eventToEmit.type,
        source: stage.eventToEmit.source,
        severity: stage.eventToEmit.severity,
        message: stage.eventToEmit.message,
      });
    }

    // Stage specific cross-dashboard state mutations
    if (stage.key === "camera_detection") {
      setSelectedCamera("CAM-03");
      setSelectedZone("Core Zone");
      setActiveClip("person");
      setIsDetecting(true);
    } else if (stage.key === "apply_rule") {
      const rule = evaluateCameraRule("person", "Core Zone");
      setDetectionHistory((prev) => [
        {
          id: "CAM-EV-108",
          cameraId: "CAM-03",
          timestamp: new Date().toLocaleTimeString(),
          clipType: "person",
          detectedClass: "HUMAN / POACHER SUSPECT",
          confidence: 94.8,
          zone: "Core Zone",
          alertLevel: rule.alertLevel,
          actionTaken: rule.action,
        },
        ...prev,
      ]);
    } else if (stage.key === "cyber_scan") {
      setIsScanning(true);
      setScanProgress(60);
      setSelectedListingId("LIST-901");
      setTimeout(() => {
        setIsScanning(false);
        setScanProgress(100);
      }, 1000);
    } else if (stage.key === "create_case") {
      setSelectedCaseId("CASE-2026-TAD-084");
    } else if (stage.key === "human_review") {
      setLinkedCases((prev) =>
        prev.map((c) => (c.id === "CASE-2026-TAD-084" ? { ...c, reviewStatus: "PENDING_REVIEW" } : c))
      );
      vk.set({
        review: [
          {
            id: "CASE-2026-TAD-084",
            title: "Correlated Core Intrusion & Cyber Tiger Part Listing",
            kind: "Linked Case",
            status: "PENDING",
            time: new Date().toLocaleTimeString().slice(0, 5),
          },
          ...vk.review.filter((r) => r.id !== "CASE-2026-TAD-084"),
        ],
      });
    }

    // Schedule next stage
    const baseDurationSec = fast ? 2 : stage.durationSec;
    const durationMs = Math.max(800, (baseDurationSec * 1000) / multiplier);

    orchestratorTimerRef.current = setTimeout(() => {
      executeStage(stageIndex + 1, fast, multiplier);
    }, durationMs);
  }, [addStreamEvent, clearOrchestratorTimers, vk]);

  const startOrchestrator = useCallback((fast = false) => {
    clearOrchestratorTimers();
    setIsFastMode(fast);
    setOrchestratorStatus("RUNNING");
    setElapsedMs(0);

    toast.info(fast ? "Fast Demo Initiated (16s Sequence)" : "Full Demo Initiated (90s Sequence)", {
      description: "Executing automated multi-sensor forest intelligence orchestration.",
    });

    // Start elapsed counter
    const startTime = Date.now();
    elapsedTimerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);

    executeStage(0, fast, speedMultiplier);
  }, [clearOrchestratorTimers, executeStage, speedMultiplier]);

  const pauseOrchestrator = useCallback(() => {
    clearOrchestratorTimers();
    setOrchestratorStatus("PAUSED");
    toast("Demo Orchestrator Paused");
  }, [clearOrchestratorTimers]);

  const resumeOrchestrator = useCallback(() => {
    if (orchestratorStatus === "PAUSED") {
      setOrchestratorStatus("RUNNING");
      executeStage(currentStageIndex, isFastMode, speedMultiplier);
      toast("Demo Orchestrator Resumed");
    }
  }, [orchestratorStatus, executeStage, currentStageIndex, isFastMode, speedMultiplier]);

  const resetOrchestrator = useCallback(() => {
    clearOrchestratorTimers();
    setOrchestratorStatus("IDLE");
    setCurrentStageIndex(0);
    setElapsedMs(0);
    toast("Demo Orchestrator Reset to Initial Ready State");
  }, [clearOrchestratorTimers]);

  const jumpToStage = useCallback((stageIndex: number) => {
    clearOrchestratorTimers();
    setOrchestratorStatus("RUNNING");
    executeStage(stageIndex, isFastMode, speedMultiplier);
  }, [clearOrchestratorTimers, executeStage, isFastMode, speedMultiplier]);

  const resetAll = useCallback(() => {
    clearOrchestratorTimers();
    setSelectedCamera("CAM-03");
    setSelectedZone("Core Zone");
    setActiveClip("person");
    setIsCameraRunning(true);
    setIsDetecting(true);
    setDetectionHistory(INITIAL_CAMERA_LOGS);
    setStrobeActive(false);
    setSpeakerActive(false);
    setListings(MOCK_CYBER_LISTINGS);
    setSelectedListingId("LIST-901");
    setSearchQuery("");
    setDistrictFilter("ALL");
    setLanguageFilter("ALL");
    setRiskFilter("ALL");
    setClassificationFilter("ALL");
    setIsScanning(false);
    setScanProgress(100);
    setFieldAlerts(INITIAL_FIELD_ALERTS);
    setLinkedCases(INITIAL_LINKED_CASES);
    setSelectedCaseId("CASE-2026-TAD-084");
    setSelectedFieldAlertId("CAM-EV-108");
    setEvidenceModalOpen(false);
    setOrchestratorStatus("IDLE");
    setCurrentStageIndex(0);
    setElapsedMs(0);
    setLiveEventStream(INITIAL_STREAM_EVENTS);
    vk.reset();
    toast.success("Demo Lab Environment Reset", {
      description: "All 4 dashboards and simulation queues restored to baseline.",
    });
  }, [clearOrchestratorTimers, vk]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      clearOrchestratorTimers();
    };
  }, [clearOrchestratorTimers]);

  const value = useMemo(
    () => ({
      // Camera
      selectedCamera,
      selectedZone,
      activeClip,
      isCameraRunning,
      isDetecting,
      detectionHistory,
      strobeActive,
      speakerActive,
      playbackSpeed,
      timelinePosition,
      setCamera,
      setZone,
      selectClip,
      toggleCamera,
      triggerDetection,
      toggleStrobe,
      triggerSpeaker,
      setPlaybackSpeed,
      setTimelinePosition,

      // Scanner
      listings,
      selectedListingId,
      searchQuery,
      districtFilter,
      languageFilter,
      riskFilter,
      classificationFilter,
      isScanning,
      scanProgress,
      crawlerInterval,
      keywordSensitivity,
      deepAnalysisMode,
      selectListing,
      setSearchQuery,
      setDistrictFilter,
      setLanguageFilter,
      setRiskFilter,
      setClassificationFilter,
      setCrawlerInterval,
      setKeywordSensitivity,
      setDeepAnalysisMode,
      runCyberScan,
      markListingForReview,
      dismissListing,
      linkListingToIncident,

      // Linked Cases
      fieldAlerts,
      linkedCases,
      selectedCaseId,
      selectedFieldAlertId,
      evidenceModalOpen,
      caseFilter,
      selectCase,
      selectFieldAlert,
      setEvidenceModalOpen,
      setCaseFilter,
      submitCaseForReview,
      markCaseReviewed,
      escalateCase,
      createManualCase,

      // Orchestrator
      orchestratorStatus,
      currentStageIndex,
      isFastMode,
      speedMultiplier,
      elapsedMs,
      liveEventStream,
      startOrchestrator,
      pauseOrchestrator,
      resumeOrchestrator,
      resetOrchestrator,
      setSpeedMultiplier,
      jumpToStage,

      // Reset
      resetAll,
    }),
    [
      selectedCamera,
      selectedZone,
      activeClip,
      isCameraRunning,
      isDetecting,
      detectionHistory,
      strobeActive,
      speakerActive,
      playbackSpeed,
      timelinePosition,
      setCamera,
      setZone,
      selectClip,
      toggleCamera,
      triggerDetection,
      toggleStrobe,
      triggerSpeaker,
      listings,
      selectedListingId,
      searchQuery,
      districtFilter,
      languageFilter,
      riskFilter,
      classificationFilter,
      isScanning,
      scanProgress,
      crawlerInterval,
      keywordSensitivity,
      deepAnalysisMode,
      selectListing,
      setSearchQuery,
      setDistrictFilter,
      setLanguageFilter,
      setRiskFilter,
      setClassificationFilter,
      setCrawlerInterval,
      setKeywordSensitivity,
      setDeepAnalysisMode,
      runCyberScan,
      markListingForReview,
      dismissListing,
      linkListingToIncident,
      fieldAlerts,
      linkedCases,
      selectedCaseId,
      selectedFieldAlertId,
      evidenceModalOpen,
      caseFilter,
      selectCase,
      selectFieldAlert,
      submitCaseForReview,
      markCaseReviewed,
      escalateCase,
      createManualCase,
      orchestratorStatus,
      currentStageIndex,
      isFastMode,
      speedMultiplier,
      elapsedMs,
      liveEventStream,
      startOrchestrator,
      pauseOrchestrator,
      resumeOrchestrator,
      resetOrchestrator,
      jumpToStage,
      resetAll,
    ]
  );

  return <DemoLabContext.Provider value={value}>{children}</DemoLabContext.Provider>;
}

export function useDemoLab() {
  const context = useContext(DemoLabContext);
  if (!context) {
    throw new Error("useDemoLab must be used within a DemoLabProvider");
  }
  return context;
}

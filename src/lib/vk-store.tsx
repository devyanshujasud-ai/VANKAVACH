import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { BASE_EVENTS, SIM_EVENTS, NODE_A, type LogEvent } from "./vk-data";

export type LeadStatus = "UNVERIFIED" | "SUBMITTED" | "REVIEWED";
export type ReviewItem = { id: string; title: string; kind: string; status: "PENDING" | "IN REVIEW" | "REVIEWED"; time: string };

const BASE_REVIEW: ReviewItem[] = [
  { id: "RPT-311", title: "Patrol note — tyre tracks (fictional)", kind: "Report", status: "PENDING", time: "19:40" },
  { id: "EV-2040", title: "Vehicle signature, S-09", kind: "Sensor event", status: "PENDING", time: "19:31" },
];

type State = {
  simulated: boolean; events: LogEvent[]; selectedSensor: string | null; toastOpen: boolean;
  correlation: "idle" | "running" | "done"; leadStatus: LeadStatus; review: ReviewItem[];
  reviewOpen: boolean; settingsOpen: boolean; query: string; crossRefOpen: boolean;
};
const initial: State = {
  simulated: false, events: BASE_EVENTS, selectedSensor: null, toastOpen: false, correlation: "idle",
  leadStatus: "UNVERIFIED", review: BASE_REVIEW, reviewOpen: false, settingsOpen: false, query: "", crossRefOpen: false,
};

type Ctx = State & {
  set: (p: Partial<State>) => void;
  runSimulation: () => void; reset: () => void;
  completeCorrelation: () => void; submitLead: () => void; markReviewed: () => void; openReviewItem: (id: string) => void;
};
const C = createContext<Ctx | null>(null);

export function VkProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const set = useCallback((p: Partial<State>) => setS((o) => ({ ...o, ...p })), []);
  const runSimulation = useCallback(() => {
    setS((o) => {
      if (o.simulated) { toast("Simulation already active", { description: "Event EV-2042 is in the log. Reset to run again." }); return { ...o, selectedSensor: NODE_A, toastOpen: true }; }
      return { ...o, simulated: true, events: [...SIM_EVENTS, ...o.events], selectedSensor: NODE_A, toastOpen: true };
    });
  }, []);
  const reset = useCallback(() => { setS(initial); toast.success("Simulation reset", { description: "All screens restored to baseline." }); }, []);
  const completeCorrelation = useCallback(() => setS((o) => ({
    ...o, correlation: "done",
    review: o.review.some((r) => r.id === "DEMO-001") ? o.review : [{ id: "DEMO-001", title: "Correlated acoustic incident", kind: "Incident", status: "PENDING", time: "20:14" }, ...o.review],
  })), []);
  const submitLead = useCallback(() => {
    setS((o) => {
      if (o.leadStatus !== "UNVERIFIED") return o;
      return { ...o, leadStatus: "SUBMITTED", review: [{ id: "DEMO-017", title: "Hypothetical wildlife-trade lead", kind: "Intel lead", status: "PENDING", time: "20:21" }, ...o.review] };
    });
    toast.success("DEMO-017 submitted for human review", { description: "Added to review queue." });
  }, []);
  const markReviewed = useCallback(() => {
    setS((o) => ({ ...o, leadStatus: "REVIEWED", review: o.review.some((r) => r.id === "DEMO-017") ? o.review.map((r) => (r.id === "DEMO-017" ? { ...r, status: "REVIEWED" } : r)) : [{ id: "DEMO-017", title: "Hypothetical wildlife-trade lead", kind: "Intel lead", status: "REVIEWED", time: "20:21" }, ...o.review] }));
    toast.success("DEMO-017 marked as reviewed", { description: "Status remains: not a verified allegation." });
  }, []);
  const openReviewItem = useCallback((id: string) => {
    setS((o) => ({ ...o, review: o.review.map((r) => (r.id === id && r.status === "PENDING" ? { ...r, status: "IN REVIEW" } : r)) }));
    toast(`Review opened: ${id}`, { description: "Assigned to Analyst R. Mehta (fictional)." });
  }, []);
  const v = useMemo(() => ({ ...s, set, runSimulation, reset, completeCorrelation, submitLead, markReviewed, openReviewItem }), [s, set, runSimulation, reset, completeCorrelation, submitLead, markReviewed, openReviewItem]);
  return <C.Provider value={v}>{children}</C.Provider>;
}
export function useVk() { const c = useContext(C); if (!c) throw new Error("VkProvider missing"); return c; }

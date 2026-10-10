import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Send,
  CheckCircle,
  AlertTriangle,
  Eye,
  Network,
  Rss,
  FileText,
  Clock,
  Shield,
  X,
} from "lucide-react";
import { useVk } from "@/lib/vk-store";
import { LEAD, GRAPH_NODES, GRAPH_EDGES } from "@/lib/vk-data";
import { INTEL_FEED } from "@/lib/vk-geo";
import { RelationshipGraph, CrossReferenceModal } from "@/components/vk/RelationshipGraph";
import { VkButton, Panel, Crumbs, Meta, Gauge } from "@/components/vk/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: "Intelligence Monitoring | VANKAVACH" },
      {
        name: "description",
        content:
          "Wildlife-trade intelligence monitoring, lead review and cross-reference analysis (simulated).",
      },
      { property: "og:title", content: "Intelligence Monitoring | VANKAVACH" },
      {
        property: "og:description",
        content: "Simulated intelligence-monitoring screen with lead cards, review controls, and intel feed.",
      },
    ],
  }),
  component: Intelligence,
});

/* ── Lead detail card ─────────────────────────────────────────────── */
function LeadCard() {
  const vk = useVk();
  const reviewed = vk.leadStatus === "REVIEWED";
  const submitted = vk.leadStatus === "SUBMITTED" || reviewed;

  return (
    <div className="vk-panel overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border bg-alert/5 px-4 py-3">
        <AlertTriangle className="text-alert" size={18} />
        <div className="flex-1">
          <div className="vk-title text-xl text-alert">{LEAD.id}</div>
          <div className="vk-label">{LEAD.category}</div>
        </div>
        <Gauge value={LEAD.confidence} label="Confidence" tone="alert" size={72} />
      </header>

      <div className="space-y-1 p-4">
        <Meta k="Title" v={LEAD.title} />
        <Meta k="Category" v={LEAD.category} />
        <Meta k="Source" v={LEAD.source} />
        <Meta k="Evidence" v={LEAD.evidence} />
        <Meta k="Received" v={LEAD.received} />
        <Meta
          k="Status"
          v={
            reviewed
              ? "REVIEWED"
              : submitted
                ? "SUBMITTED — awaiting review"
                : "UNVERIFIED"
          }
          tone={reviewed ? "primary" : "alert"}
        />
      </div>

      <div className="border-t border-border px-4 py-3">
        <div className="vk-label mb-2">Summary</div>
        <p className="text-sm text-muted-foreground">{LEAD.summary}</p>
      </div>

      <div className="border-t border-border px-4 py-3">
        <div className="vk-label mb-2">Linked Records</div>
        <ul className="space-y-1">
          {LEAD.linked.map((l) => (
            <li key={l} className="flex items-center gap-2 text-xs">
              <FileText size={12} className="text-primary" />
              <span className="font-mono">{l}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 border-t border-border p-4">
        <VkButton
          variant="alert"
          size="sm"
          disabled={submitted}
          onClick={() => vk.submitLead()}
        >
          <Send size={13} />
          {submitted ? "Submitted" : "Submit for Review"}
        </VkButton>
        <VkButton
          variant={reviewed ? "ghost" : "alertOutline"}
          size="sm"
          disabled={!submitted || reviewed}
          onClick={() => vk.markReviewed()}
        >
          <CheckCircle size={13} />
          {reviewed ? "Reviewed ✓" : "Mark as Reviewed"}
        </VkButton>
      </div>
    </div>
  );
}

/* ── Intelligence feed list ───────────────────────────────────────── */
function IntelFeed() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Panel
      title="Intelligence Feed"
      right={
        <span className="font-mono text-[10px] text-primary">
          {INTEL_FEED.length} ITEMS
        </span>
      }
    >
      <div className="vk-label flex items-center gap-1 border-b border-border px-3 py-2">
        <Rss size={11} /> SIMULATED FEED — ALL DATA FICTIONAL
      </div>
      <ul className="max-h-[480px] overflow-auto">
        {INTEL_FEED.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              className={cn(
                "w-full border-b border-border/40 px-4 py-3 text-left hover:bg-accent",
                expanded === item.id && "bg-accent",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-mono text-[10px] px-1.5 py-0.5 border rounded-sm",
                      item.status === "NEW"
                        ? "border-alert/50 text-alert bg-alert/10"
                        : item.status === "TRIAGED"
                          ? "border-primary/40 text-primary bg-primary/10"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {item.status}
                  </span>
                  <span className="font-mono text-xs text-primary">{item.id}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {item.time}
                </span>
              </div>
              <div className="mt-1 text-sm">{item.summary}</div>
              {expanded === item.id && (
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground anim-in">
                  <span className="vk-label">Source</span>
                  <span>{item.source}</span>
                  <span className="vk-label">Category</span>
                  <span>{item.category}</span>
                  <span className="vk-label">Region</span>
                  <span>{item.region}</span>
                  <span className="vk-label">Confidence</span>
                  <span
                    className={cn(
                      "font-mono",
                      item.confidence > 40 ? "text-alert" : "text-muted-foreground",
                    )}
                  >
                    {item.confidence}%
                  </span>
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ── Main intelligence page ───────────────────────────────────────── */
function Intelligence() {
  const vk = useVk();
  const nav = useNavigate();
  const [crossRef, setCrossRef] = useState(false);

  return (
    <div className="vk-grid min-h-full p-6">
      <Crumbs items={["VANKAVACH", "Monitoring", "Intelligence"]} />
      <div className="mt-2 flex items-end justify-between">
        <div>
          <h1 className="vk-title text-4xl">Intelligence Monitoring</h1>
          <p className="text-muted-foreground">
            Simulated intelligence feed & wildlife-trade lead analysis
          </p>
        </div>
        <div className="flex gap-2">
          <VkButton variant="ghost" onClick={() => nav({ to: "/" })}>
            <ArrowLeft size={14} />
            Back to Map
          </VkButton>
          <VkButton onClick={() => setCrossRef(true)}>
            <Network size={14} />
            Cross-Reference Graph
          </VkButton>
          <VkButton
            variant="ghost"
            onClick={() => vk.set({ reviewOpen: true })}
          >
            <Shield size={14} />
            Review Queue
          </VkButton>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_380px] gap-4">
        {/* Left: Lead card + relationship mini graph */}
        <div className="flex flex-col gap-4">
          <LeadCard />

          {/* Mini relationship graph */}
          <Panel title="Relationship Graph (Intelligence Layer)" className="h-[360px]">
            <RelationshipGraph filter="intelligence" compact onSelect={() => {}} />
          </Panel>

          {/* Review status strip */}
          <div className="vk-panel flex items-center gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              <span className="vk-label">Lead Status</span>
              <span
                className={cn(
                  "font-mono text-xs",
                  vk.leadStatus === "REVIEWED"
                    ? "text-primary"
                    : vk.leadStatus === "SUBMITTED"
                      ? "text-alert"
                      : "text-muted-foreground",
                )}
              >
                {vk.leadStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="vk-label">Pending Reviews</span>
              <span className="font-mono text-xs text-alert">
                {vk.review.filter((r) => r.status !== "REVIEWED").length}
              </span>
            </div>
            <div className="ml-auto flex gap-2">
              <VkButton
                size="sm"
                variant="alert"
                disabled={vk.leadStatus !== "UNVERIFIED"}
                onClick={() => vk.submitLead()}
              >
                <Send size={12} />
                Submit Lead
              </VkButton>
              <VkButton
                size="sm"
                variant="alertOutline"
                disabled={
                  vk.leadStatus === "UNVERIFIED" || vk.leadStatus === "REVIEWED"
                }
                onClick={() => vk.markReviewed()}
              >
                <CheckCircle size={12} />
                Mark Reviewed
              </VkButton>
            </div>
          </div>
        </div>

        {/* Right: Intel feed */}
        <div className="flex flex-col gap-4">
          <IntelFeed />

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Active Leads", "1"],
              ["Feed Items", `${INTEL_FEED.length}`],
              ["Graph Nodes", `${GRAPH_NODES.length}`],
              ["Graph Links", `${GRAPH_EDGES.length}`],
            ].map(([k, v]) => (
              <div key={k} className="vk-panel p-3">
                <div className="vk-label text-[9px]">{k}</div>
                <div className="font-mono text-lg text-primary">{v}</div>
              </div>
            ))}
          </div>

          <div className="vk-panel border-l-2 border-alert bg-alert/5 p-3 text-xs text-muted-foreground">
            <strong className="text-alert">TRAINING SCENARIO</strong> — All intelligence items,
            leads, and entities shown here are synthetic data created for demonstration purposes.
            Nothing on this screen represents a verified allegation or real intelligence product.
          </div>
        </div>
      </div>

      {crossRef && <CrossReferenceModal onClose={() => setCrossRef(false)} />}
    </div>
  );
}

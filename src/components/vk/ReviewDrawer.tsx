import { X, ShieldAlert } from "lucide-react";
import { useVk } from "@/lib/vk-store";
import { VkButton } from "./ui";
import { cn } from "@/lib/utils";

export function ReviewDrawer() {
  const vk = useVk();
  if (!vk.reviewOpen) return null;
  const pending = vk.review.filter((r) => r.status !== "REVIEWED").length;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-background/50" onClick={() => vk.set({ reviewOpen: false })}>
      <aside className="anim-in flex h-full w-[400px] flex-col border-l border-alert/40 bg-panel" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center gap-2 border-b border-border p-4">
          <ShieldAlert className="text-alert" size={18} />
          <div><h2 className="vk-title text-lg text-alert">Human Review Required</h2><p className="vk-label">{pending} pending · {vk.review.length} total</p></div>
          <button aria-label="Close review drawer" className="ml-auto" onClick={() => vk.set({ reviewOpen: false })}><X size={16} /></button>
        </header>
        <div className="flex-1 space-y-2 overflow-auto p-3">
          {vk.review.map((r) => (
            <div key={r.id} className={cn("border p-3", r.status === "REVIEWED" ? "border-border opacity-70" : "border-alert/40 bg-alert/5")}>
              <div className="flex items-center justify-between"><span className="font-mono text-xs text-primary">{r.id}</span>
                <span className={cn("font-mono text-[10px] px-1.5 border", r.status === "REVIEWED" ? "border-primary/40 text-primary" : r.status === "IN REVIEW" ? "border-foreground/40" : "border-alert/50 text-alert")}>{r.status}</span></div>
              <div className="mt-1 text-sm">{r.title}</div>
              <div className="mt-1 flex items-center justify-between"><span className="vk-label">{r.kind} · {r.time} IST</span>
                <VkButton size="sm" variant={r.status === "REVIEWED" ? "ghost" : "alertOutline"} disabled={r.status === "REVIEWED"} onClick={() => vk.openReviewItem(r.id)}>{r.status === "REVIEWED" ? "Closed" : "Open Review"}</VkButton></div>
            </div>
          ))}
        </div>
        <footer className="border-t border-border p-3 vk-label">Simulated records. Nothing here is a verified allegation.</footer>
      </aside>
    </div>
  );
}

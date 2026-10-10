import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Bell, Search, Settings, User, LayoutDashboard, Activity, MapPinned, Network, LayoutGrid, RotateCcw, X, ClipboardCheck, Camera, Radio, GitFork, PlaySquare, FlaskConical } from "lucide-react";
import { useVk } from "@/lib/vk-store";
import { VkButton } from "./ui";
import { ReviewDrawer } from "./ReviewDrawer";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <path d="M16 2 L28 7 V16 C28 23 22 28 16 30 C10 28 4 23 4 16 V7 Z" className="fill-primary/15 stroke-primary" strokeWidth="1.5" />
      <path d="M16 8 C11 13 11 19 16 24 C21 19 21 13 16 8 Z" className="fill-primary" />
      <path d="M16 11 V24" className="stroke-background" strokeWidth="1.2" />
    </svg>
  );
}
export function SimulationBadge({ text = "SIMULATION MODE — ALL DATA FICTIONAL" }: { text?: string }) {
  return (
    <span className="flex items-center gap-2 border border-alert/50 bg-alert/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-alert">
      <span className="h-1.5 w-1.5 rounded-full bg-alert anim-pulse" />{text}
    </span>
  );
}

const CORE_NAV = [
  { to: "/", icon: LayoutDashboard, label: "Forest Monitoring" },
  { to: "/correlation", icon: Activity, label: "AI Signal Correlation" },
  { to: "/incident-area", icon: MapPinned, label: "Incident Location" },
  { to: "/intelligence", icon: Network, label: "Intelligence Monitoring" },
  { to: "/overview", icon: LayoutGrid, label: "Incident & Intel Overview" },
] as const;

const DEMO_LAB_NAV = [
  { to: "/demo-lab/camera", icon: Camera, label: "Camera Detection" },
  { to: "/demo-lab/cyber-scanner", icon: Radio, label: "Cyber Wildlife-Trade Scanner" },
  { to: "/demo-lab/linked-cases", icon: GitFork, label: "Linked Case Investigation" },
  { to: "/demo-lab/orchestrator", icon: PlaySquare, label: "Demo Orchestrator" },
] as const;

function TopBar() {
  const vk = useVk();
  const nav = useNavigate();
  const [notif, setNotif] = useState(false);
  const pending = vk.review.filter((r) => r.status !== "REVIEWED").length;
  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-panel px-4">
      <Link to="/" className="flex items-center gap-2.5">
        <Logo />
        <div className="leading-none">
          <div className="vk-title text-lg text-foreground tracking-[0.2em]">VANKAVACH</div>
          <div className="vk-label text-[9px]">Forest Monitoring &amp; Intelligence System</div>
        </div>
      </Link>
      <SimulationBadge />
      <div className="ml-auto flex items-center gap-2">
        <label className="flex h-8 w-64 items-center gap-2 border border-border bg-background px-2">
          <Search size={14} className="text-muted-foreground" />
          <input value={vk.query} onChange={(e) => vk.set({ query: e.target.value })} placeholder="Search sensors, events, records…" className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground" />
          {vk.query && <button aria-label="Clear search" onClick={() => vk.set({ query: "" })}><X size={12} /></button>}
        </label>
        <VkButton variant="ghost" size="sm" onClick={vk.reset} title="Reset simulation"><RotateCcw size={13} />Reset Simulation</VkButton>
        <div className="relative">
          <button aria-label="Notifications" onClick={() => setNotif((n) => !n)} className="relative p-2 text-muted-foreground hover:text-foreground">
            <Bell size={17} />
            {(vk.simulated || pending > 0) && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-alert" />}
          </button>
          {notif && (
            <div className="anim-in absolute right-0 top-10 w-80 vk-panel p-2 shadow-2xl">
              <div className="vk-label px-1 pb-2">Notifications</div>
              {vk.simulated && (
                <button onClick={() => { setNotif(false); nav({ to: "/" }); vk.set({ selectedSensor: "S-04" }); }} className="w-full border-l-2 border-alert bg-alert/5 p-2 text-left text-xs hover:bg-alert/10">
                  <div className="font-semibold text-alert">Acoustic event detected — S-04 / S-07</div><div className="text-muted-foreground">20:14:36 · Potential forest disturbance</div>
                </button>
              )}
              <button onClick={() => { setNotif(false); vk.set({ reviewOpen: true }); }} className="mt-1 w-full border-l-2 border-primary p-2 text-left text-xs hover:bg-accent">
                <div className="font-semibold">{pending} records awaiting human review</div><div className="text-muted-foreground">Open review queue</div>
              </button>
            </div>
          )}
        </div>
        <button aria-label="Review queue" onClick={() => vk.set({ reviewOpen: true })} className="relative p-2 text-muted-foreground hover:text-foreground">
          <ClipboardCheck size={17} />
          {pending > 0 && <span className="absolute -right-0.5 -top-0.5 font-mono text-[9px] bg-primary text-primary-foreground px-1">{pending}</span>}
        </button>
        <button aria-label="Settings" onClick={() => vk.set({ settingsOpen: true })} className="p-2 text-muted-foreground hover:text-foreground"><Settings size={17} /></button>
        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="grid h-8 w-8 place-items-center bg-accent"><User size={15} /></div>
          <div className="leading-tight"><div className="text-xs">R. Mehta</div><div className="vk-label text-[9px]">Duty Analyst (fictional)</div></div>
        </div>
      </div>
    </header>
  );
}

function SideNavigation() {
  const loc = useLocation();
  const vk = useVk();
  return (
    <nav className="z-20 flex w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-panel py-2 overflow-y-auto overflow-x-hidden">
      {/* Vankavach Core Navigation */}
      {CORE_NAV.map(({ to, icon: I, label }) => {
        const active = loc.pathname === to;
        return (
          <Link key={to} to={to} aria-label={label} className={cn("group relative grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm", active && "text-primary bg-primary/10 border-l-2 border-primary")}>
            <I size={17} />
            <span className="pointer-events-none absolute left-12 whitespace-nowrap vk-panel px-2 py-1 text-xs opacity-0 group-hover:opacity-100 text-foreground z-50 shadow-lg">{label}</span>
          </Link>
        );
      })}

      {/* DEMO LAB Section Divider */}
      <div className="my-1.5 flex flex-col items-center w-full px-2">
        <div className="h-px w-full bg-border" />
        <span className="mt-1 font-mono text-[8px] font-bold text-primary/80 tracking-widest uppercase">LAB</span>
      </div>

      {/* DEMO LAB Navigation */}
      {DEMO_LAB_NAV.map(({ to, icon: I, label }) => {
        const active = loc.pathname === to;
        return (
          <Link key={to} to={to} aria-label={`Demo Lab: ${label}`} className={cn("group relative grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm", active && "text-primary bg-primary/15 border-l-2 border-primary ring-1 ring-primary/30")}>
            <I size={17} className={active ? "text-primary" : ""} />
            <span className="pointer-events-none absolute left-12 whitespace-nowrap vk-panel px-2.5 py-1 text-xs opacity-0 group-hover:opacity-100 text-foreground z-50 shadow-lg border border-primary/40">
              <span className="text-[10px] font-mono text-primary mr-1.5 uppercase tracking-wider font-bold">[DEMO LAB]</span>
              {label}
            </span>
          </Link>
        );
      })}

      <button aria-label="Settings" onClick={() => vk.set({ settingsOpen: true })} className="group relative mt-auto grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm">
        <Settings size={17} />
        <span className="pointer-events-none absolute left-12 whitespace-nowrap vk-panel px-2 py-1 text-xs opacity-0 group-hover:opacity-100 text-foreground z-50 shadow-lg">Settings</span>
      </button>
    </nav>
  );
}


function SettingsModal() {
  const vk = useVk();
  const [sens, setSens] = useState(70);
  if (!vk.settingsOpen) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm" onClick={() => vk.set({ settingsOpen: false })}>
      <div className="anim-in w-[420px] vk-panel p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="vk-title text-lg">System Settings</h2><button aria-label="Close" onClick={() => vk.set({ settingsOpen: false })}><X size={16} /></button></div>
        <p className="mt-1 text-xs text-muted-foreground">Prototype settings — stored locally for this session only.</p>
        <label className="mt-4 block vk-label">Acoustic detection sensitivity: <span className="text-primary">{sens}%</span></label>
        <input type="range" min={30} max={95} value={sens} onChange={(e) => setSens(+e.target.value)} className="w-full accent-primary" />
        <div className="mt-4 flex gap-2">
          <VkButton variant="alertOutline" size="sm" onClick={() => { vk.reset(); vk.set({ settingsOpen: false }); }}><RotateCcw size={13} />Reset Simulation</VkButton>
          <VkButton variant="primary" size="sm" className="ml-auto" onClick={() => vk.set({ settingsOpen: false })}>Save &amp; Close</VkButton>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <SideNavigation />
        <main className="relative min-w-0 flex-1 overflow-auto">{children}</main>
      </div>
      <SettingsModal />
      <ReviewDrawer />
    </div>
  );
}

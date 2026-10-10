import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Globe,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  RotateCcw,
  SlidersHorizontal,
  FileText,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { useDemoLab } from "@/lib/demo-lab-store";
import {
  type ListingDistrict,
  type ListingLanguage,
  type ListingClassification,
  type CyberListing,
} from "@/lib/demo-lab-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo-lab/cyber-scanner")({
  head: () => ({
    meta: [
      { title: "Cyber Wildlife-Trade Scanner | VANKAVACH DEMO LAB" },
      {
        name: "description",
        content:
          "High-density Cyber Wildlife-Trade Scanner tracking 20 multilingual listings across Maharashtra with risk classification and intelligence linking.",
      },
    ],
  }),
  component: CyberScannerDashboard,
});

function CyberScannerDashboard() {
  const lab = useDemoLab();
  const [selectedTab, setSelectedTab] = useState<"ALL" | "FLAGGED" | "CLEARED">("ALL");

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    return lab.listings.filter((item) => {
      // Search query
      if (
        lab.searchQuery &&
        !item.title.toLowerCase().includes(lab.searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(lab.searchQuery.toLowerCase()) &&
        !item.matchedKeywords.some((k) => k.toLowerCase().includes(lab.searchQuery.toLowerCase()))
      ) {
        return false;
      }

      // District filter
      if (lab.districtFilter !== "ALL" && item.district !== lab.districtFilter) {
        return false;
      }

      // Language filter
      if (lab.languageFilter !== "ALL" && item.language !== lab.languageFilter) {
        return false;
      }

      // Classification filter
      if (lab.classificationFilter !== "ALL" && item.classification !== lab.classificationFilter) {
        return false;
      }

      // Risk filter
      if (lab.riskFilter === "HIGH" && item.riskScore < 75) return false;
      if (lab.riskFilter === "MEDIUM" && (item.riskScore < 40 || item.riskScore >= 75)) return false;
      if (lab.riskFilter === "LOW" && item.riskScore >= 40) return false;

      // Tab filter
      if (selectedTab === "FLAGGED" && item.riskScore < 40) return false;
      if (selectedTab === "CLEARED" && item.riskScore >= 40) return false;

      return true;
    });
  }, [
    lab.listings,
    lab.searchQuery,
    lab.districtFilter,
    lab.languageFilter,
    lab.riskFilter,
    lab.classificationFilter,
    selectedTab,
  ]);

  const selectedListing =
    lab.listings.find((l) => l.id === lab.selectedListingId) ||
    filteredListings[0] ||
    lab.listings[0];

  // Metric strip calculation
  const totalScanned = 1428;
  const flaggedLeads = lab.listings.filter((l) => l.riskScore >= 40).length;
  const highRiskLeads = lab.listings.filter((l) => l.riskScore >= 75).length;
  const pendingReview = lab.listings.filter((l) => l.reviewStatus === "PENDING_REVIEW").length;

  return (
    <div className="flex h-full flex-col bg-[#07110E] text-[#E8F0EB] select-none font-sans overflow-hidden">
      {/* Top Banner / Breadcrumb Strip */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#263A30] bg-[#0B1712] px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C9F92]">
            <span className="text-[#55D6A3] font-bold">DEMO LAB</span>
            <span>/</span>
            <span className="text-[#E8F0EB] uppercase tracking-wider font-semibold">
              Cyber Wildlife-Trade Scanner
            </span>
          </div>
          <span className="rounded bg-[#55D6A3]/10 border border-[#55D6A3]/30 px-2 py-0.5 font-mono text-[10px] text-[#55D6A3]">
            CRAWLER AGENT ACTIVE · VIDARBHA MIRRORS
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={lab.runCyberScan}
            disabled={lab.isScanning}
            className="flex items-center gap-1.5 rounded bg-[#55D6A3] px-3 py-1 text-[11px] font-bold text-[#07110E] hover:bg-[#47c695] transition-all shadow-[0_0_12px_rgba(85,214,163,0.3)] disabled:opacity-50"
          >
            <Radio size={12} className={lab.isScanning ? "anim-pulse" : ""} />
            {lab.isScanning ? `SCANNING (${lab.scanProgress}%)` : "RUN SCAN NOW"}
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

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#263A30] border-b border-[#263A30] bg-[#0B1712]">
        <div className="p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">Listings Scanned</div>
            <div className="text-xl font-mono font-bold text-[#E8F0EB] mt-0.5">{totalScanned.toLocaleString()}</div>
          </div>
          <span className="text-[10px] font-mono text-[#55D6A3] bg-[#55D6A3]/10 px-2 py-1 rounded border border-[#55D6A3]/30 flex items-center gap-1">
            <TrendingUp size={11} /> +142/hr
          </span>
        </div>

        <div className="p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">Flagged Leads</div>
            <div className="text-xl font-mono font-bold text-[#F4A62A] mt-0.5">{flaggedLeads} Leads</div>
          </div>
          <span className="text-[10px] font-mono text-[#F4A62A] bg-[#F4A62A]/10 px-2 py-1 rounded border border-[#F4A62A]/30">
            AMBER SUSPICIOUS
          </span>
        </div>

        <div className="p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">High-Risk Leads</div>
            <div className="text-xl font-mono font-bold text-[#F05B51] mt-0.5">{highRiskLeads} Leads</div>
          </div>
          <span className="text-[10px] font-mono text-[#F05B51] bg-[#F05B51]/10 px-2 py-1 rounded border border-[#F05B51]/30">
            &gt;= 75% RISK
          </span>
        </div>

        <div className="p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#8C9F92] uppercase font-bold">Pending Human Review</div>
            <div className="text-xl font-mono font-bold text-[#55D6A3] mt-0.5">{pendingReview} Queued</div>
          </div>
          <span className="text-[10px] font-mono text-[#55D6A3] bg-[#55D6A3]/10 px-2 py-1 rounded border border-[#55D6A3]/30">
            CENTRAL DESK
          </span>
        </div>
      </div>

      {/* Scanning Progress Bar (Shows when scanning is triggered) */}
      {lab.isScanning && (
        <div className="h-1 bg-[#162A20] w-full overflow-hidden">
          <div
            className="h-full bg-[#55D6A3] transition-all duration-300"
            style={{ width: `${lab.scanProgress}%` }}
          />
        </div>
      )}

      {/* Main 3-Section High-Density Intelligence Workspace */}
      <div className="grid flex-1 grid-cols-12 min-h-0 divide-x divide-[#263A30] overflow-hidden">
        {/* ==================================================== */}
        {/* LEFT PANEL: FILTERS & SCAN SETTINGS (Col 3)          */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0 bg-[#0B1712] p-3 overflow-y-auto space-y-3.5">
          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold text-[#8C9F92] uppercase block">
              Search Listings &amp; Keywords
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-[#8C9F92]" />
              <input
                type="text"
                value={lab.searchQuery}
                onChange={(e) => lab.setSearchQuery(e.target.value)}
                placeholder="Search claws, pelt, tiger, वाघ..."
                className="w-full rounded border border-[#263A30] bg-[#101F18] py-1.5 pl-8 pr-3 text-xs text-[#E8F0EB] placeholder:text-[#8C9F92]/60 focus:border-[#55D6A3] focus:outline-none"
              />
              {lab.searchQuery && (
                <button
                  onClick={() => lab.setSearchQuery("")}
                  className="absolute right-2 top-2 text-[10px] font-mono text-[#8C9F92] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* District Filter */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold text-[#8C9F92] uppercase block">
              District Jurisdiction
            </label>
            <div className="grid grid-cols-2 gap-1 font-mono text-xs">
              {(["ALL", "Chandrapur", "Nagpur", "Wardha", "Bhandara", "Gadchiroli"] as const).map(
                (dist) => (
                  <button
                    key={dist}
                    onClick={() => lab.setDistrictFilter(dist)}
                    className={cn(
                      "px-2 py-1.5 rounded text-left border transition-colors",
                      lab.districtFilter === dist
                        ? "border-[#55D6A3] bg-[#55D6A3]/10 text-[#55D6A3] font-bold"
                        : "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB] hover:bg-[#162A20]"
                    )}
                  >
                    {dist}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Language Filter */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold text-[#8C9F92] uppercase block">
              Language Script
            </label>
            <div className="grid grid-cols-4 gap-1 font-mono text-xs text-center">
              {(["ALL", "English", "Hindi", "Marathi"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => lab.setLanguageFilter(lang)}
                  className={cn(
                    "py-1.5 rounded border transition-colors",
                    lab.languageFilter === lang
                      ? "border-[#55D6A3] bg-[#55D6A3]/10 text-[#55D6A3] font-bold"
                      : "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB]"
                  )}
                >
                  {lang === "ALL" ? "All" : lang.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Level Filter */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold text-[#8C9F92] uppercase block">
              Risk Level Tier
            </label>
            <div className="space-y-1 text-xs font-mono">
              {[
                { key: "ALL", label: "All Risk Levels" },
                { key: "HIGH", label: "High Risk (>=75%)", color: "text-[#F05B51]" },
                { key: "MEDIUM", label: "Medium Risk (40-74%)", color: "text-[#F4A62A]" },
                { key: "LOW", label: "Harmless / Low (<40%)", color: "text-[#55D6A3]" },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => lab.setRiskFilter(key as any)}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded border flex items-center justify-between transition-colors",
                    lab.riskFilter === key
                      ? "border-[#55D6A3] bg-[#55D6A3]/10 text-[#55D6A3] font-bold"
                      : "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB]"
                  )}
                >
                  <span className={color}>{label}</span>
                  {lab.riskFilter === key && <span className="text-[10px]">●</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Classification Filter */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold text-[#8C9F92] uppercase block">
              Content Classification
            </label>
            <div className="space-y-1 text-xs">
              {(
                [
                  "ALL",
                  "Parts & Derivatives",
                  "Live Animal",
                  "Trapping Equipment",
                  "Legitimate Conservation",
                  "Academic",
                ] as const
              ).map((cls) => (
                <button
                  key={cls}
                  onClick={() => lab.setClassificationFilter(cls)}
                  className={cn(
                    "w-full text-left px-2 py-1 rounded border transition-colors truncate",
                    lab.classificationFilter === cls
                      ? "border-[#55D6A3] bg-[#55D6A3]/10 text-[#55D6A3] font-bold"
                      : "border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB]"
                  )}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Scan Settings */}
          <div className="rounded border border-[#263A30] bg-[#0E1B15] p-3 space-y-2.5">
            <span className="font-mono text-[10px] font-bold text-[#8C9F92] uppercase block">
              Crawler Settings
            </span>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-[#8C9F92]">
                <span>Interval</span>
                <span className="text-[#55D6A3]">{lab.crawlerInterval}m</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={lab.crawlerInterval}
                onChange={(e) => lab.setCrawlerInterval(Number(e.target.value))}
                className="w-full accent-[#55D6A3] h-1 bg-[#162A20]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-[#8C9F92]">
                <span>Sensitivity</span>
                <span className="text-[#55D6A3]">{lab.keywordSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={lab.keywordSensitivity}
                onChange={(e) => lab.setKeywordSensitivity(Number(e.target.value))}
                className="w-full accent-[#55D6A3] h-1 bg-[#162A20]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#8C9F92]">Deep Semantic NLP</span>
              <button
                onClick={() => lab.setDeepAnalysisMode(!lab.deepAnalysisMode)}
                className={cn(
                  "px-2 py-0.5 rounded font-mono text-[10px] font-bold border",
                  lab.deepAnalysisMode
                    ? "border-[#55D6A3] bg-[#55D6A3]/20 text-[#55D6A3]"
                    : "border-[#263A30] bg-[#101F18] text-[#8C9F92]"
                )}
              >
                {lab.deepAnalysisMode ? "ENABLED" : "OFF"}
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* CENTER PANEL: HIGH-DENSITY LISTINGS TABLE (Col 5)    */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0 bg-[#07110E] overflow-hidden">
          {/* Table Header Strip with Tabs */}
          <div className="flex items-center justify-between border-b border-[#263A30] bg-[#0B1712] px-3 py-2">
            <div className="flex items-center gap-1 font-mono text-xs">
              {(["ALL", "FLAGGED", "CLEARED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={cn(
                    "px-2.5 py-1 rounded transition-colors",
                    selectedTab === tab
                      ? "bg-[#101F18] text-[#55D6A3] font-bold border border-[#263A30]"
                      : "text-[#8C9F92] hover:text-[#E8F0EB]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="font-mono text-[11px] text-[#8C9F92]">
              Showing <span className="text-[#55D6A3] font-bold">{filteredListings.length}</span> of 20
            </div>
          </div>

          {/* Table Scrollable Container */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-[#0E1B15] text-[10px] font-mono text-[#8C9F92] uppercase border-b border-[#263A30]">
                <tr>
                  <th className="py-2 px-3">Listing ID</th>
                  <th className="py-2 px-3">Title &amp; Platform</th>
                  <th className="py-2 px-2 text-center">District</th>
                  <th className="py-2 px-2 text-right">Risk</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263A30]/50">
                {filteredListings.map((item) => {
                  const isSelected = item.id === selectedListing?.id;
                  const isHighRisk = item.riskScore >= 75;
                  const isMedRisk = item.riskScore >= 40 && item.riskScore < 75;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => lab.selectListing(item.id)}
                      className={cn(
                        "cursor-pointer transition-colors group",
                        isSelected
                          ? "bg-[#162B21] border-l-2 border-[#55D6A3]"
                          : isHighRisk
                          ? "hover:bg-[#F05B51]/5"
                          : isMedRisk
                          ? "hover:bg-[#F4A62A]/5"
                          : "hover:bg-[#101F18]"
                      )}
                    >
                      {/* ID + Language Badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                        <div className="font-bold text-[#E8F0EB] group-hover:text-[#55D6A3]">
                          {item.id}
                        </div>
                        <div className="text-[9px] text-[#8C9F92] flex items-center gap-1 mt-0.5">
                          <span className="rounded bg-[#07110E] px-1 border border-[#263A30]">
                            {item.language.slice(0, 3)}
                          </span>
                          <span>{item.date.slice(5)}</span>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-2.5 px-3 max-w-[210px]">
                        <div className="font-medium text-[#E8F0EB] truncate leading-tight">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#8C9F92] truncate mt-0.5">
                          {item.classification} · {item.platform.split(" [")[0]}
                        </div>
                      </td>

                      {/* District */}
                      <td className="py-2.5 px-2 text-center font-mono text-[10px] text-[#8C9F92] whitespace-nowrap">
                        {item.district}
                      </td>

                      {/* Risk Score */}
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <div
                          className={cn(
                            "inline-block px-1.5 py-0.5 rounded font-mono text-[11px] font-bold",
                            isHighRisk
                              ? "bg-[#F05B51]/20 text-[#F05B51] border border-[#F05B51]/40"
                              : isMedRisk
                              ? "bg-[#F4A62A]/20 text-[#F4A62A] border border-[#F4A62A]/40"
                              : "bg-[#55D6A3]/15 text-[#55D6A3] border border-[#55D6A3]/30"
                          )}
                        >
                          {item.riskScore}%
                        </div>
                      </td>

                      {/* Review Status */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            "text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold",
                            item.reviewStatus === "PENDING_REVIEW"
                              ? "bg-[#F4A62A]/20 text-[#F4A62A]"
                              : item.reviewStatus === "REVIEWED"
                              ? "bg-[#55D6A3]/20 text-[#55D6A3]"
                              : item.reviewStatus === "DISMISSED"
                              ? "bg-[#8C9F92]/20 text-[#8C9F92]"
                              : "bg-[#263A30] text-[#8C9F92]"
                          )}
                        >
                          {item.reviewStatus.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredListings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#8C9F92]">
                      No listings match your search criteria.
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            lab.setSearchQuery("");
                            lab.setDistrictFilter("ALL");
                            lab.setLanguageFilter("ALL");
                            lab.setRiskFilter("ALL");
                            lab.setClassificationFilter("ALL");
                          }}
                          className="text-[#55D6A3] underline hover:text-white"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT PANEL: SELECTED LISTING DETAILS (Col 4)       */}
        {/* ==================================================== */}
        <div className="col-span-12 lg:col-span-4 flex flex-col min-h-0 bg-[#0B1712] p-4 overflow-y-auto space-y-3.5">
          {selectedListing ? (
            <>
              {/* Header Details Strip */}
              <div className="flex items-center justify-between pb-2 border-b border-[#263A30]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#55D6A3]">
                    {selectedListing.id}
                  </span>
                  <span className="rounded bg-[#07110E] px-2 py-0.5 font-mono text-[10px] text-[#8C9F92] border border-[#263A30]">
                    {selectedListing.language}
                  </span>
                </div>

                <div className="font-mono text-[10px] text-[#8C9F92]">
                  {selectedListing.date} {selectedListing.time}
                </div>
              </div>

              {/* Title & Platform */}
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#E8F0EB] leading-snug">
                  {selectedListing.title}
                </h3>
                <div className="text-xs text-[#55D6A3] font-mono flex items-center gap-1.5">
                  <Globe size={12} />
                  <span>{selectedListing.platform}</span>
                </div>
              </div>

              {/* Risk Score Radial Meter */}
              <div
                className={cn(
                  "rounded border p-3 flex items-center justify-between",
                  selectedListing.riskScore >= 75
                    ? "border-[#F05B51]/60 bg-[#F05B51]/10"
                    : selectedListing.riskScore >= 40
                    ? "border-[#F4A62A]/60 bg-[#F4A62A]/10"
                    : "border-[#55D6A3]/40 bg-[#55D6A3]/5"
                )}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C9F92] block font-bold">
                    Risk Assessment Score
                  </span>
                  <div className="text-2xl font-mono font-bold text-[#E8F0EB] mt-0.5">
                    {selectedListing.riskScore}%
                  </div>
                  <div className="text-[11px] font-medium text-[#8C9F92] mt-0.5">
                    {selectedListing.riskScore >= 75
                      ? "High Threat Priority — WPA Schedule I"
                      : selectedListing.riskScore >= 40
                      ? "Suspicious Potential Evasion Lead"
                      : "Harmless Educational / Ecotourism"}
                  </div>
                </div>

                <div className="relative h-14 w-14 flex items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      className="stroke-[#263A30]"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      stroke={
                        selectedListing.riskScore >= 75
                          ? "#F05B51"
                          : selectedListing.riskScore >= 40
                          ? "#F4A62A"
                          : "#55D6A3"
                      }
                      strokeWidth="3"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * selectedListing.riskScore) / 100}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-bold">
                    {selectedListing.riskScore}
                  </span>
                </div>
              </div>

              {/* Matched Keywords Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-[#8C9F92] uppercase font-bold block">
                  Matched Tactical Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedListing.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded bg-[#162A20] px-2 py-0.5 font-mono text-[10px] text-[#55D6A3] border border-[#263A30]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* NLP Explanation */}
              <div className="rounded border border-[#263A30] bg-[#101F18] p-3 space-y-1.5">
                <span className="text-[10px] font-mono text-[#8C9F92] uppercase font-bold block">
                  Automated Classifier Rationale
                </span>
                <p className="text-xs text-[#E8F0EB]/90 leading-relaxed">
                  {selectedListing.explanation}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-[#55D6A3]">
                  <span>Species:</span>
                  <span className="font-bold">{selectedListing.species}</span>
                </div>
              </div>

              {/* Source Metadata */}
              <div className="rounded border border-[#263A30] bg-[#0E1B15] p-3 space-y-2 font-mono text-xs">
                <span className="text-[10px] text-[#8C9F92] uppercase font-bold block">
                  Source Geolocation &amp; Identity
                </span>
                <div className="space-y-1 text-[#8C9F92] text-[11px]">
                  <div className="flex justify-between">
                    <span>Author / Alias:</span>
                    <span className="text-[#E8F0EB]">{selectedListing.sourceMetadata.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IP Triangulation:</span>
                    <span className="text-[#E8F0EB]">{selectedListing.sourceMetadata.ipLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact Channel:</span>
                    <span className="text-[#55D6A3]">{selectedListing.sourceMetadata.contactHandle}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => lab.markListingForReview(selectedListing.id)}
                    className="py-2 px-3 rounded text-xs font-mono font-bold bg-[#F4A62A] text-black hover:bg-[#e0931d] transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 size={13} />
                    MARK FOR REVIEW
                  </button>

                  <button
                    onClick={() => lab.dismissListing(selectedListing.id)}
                    className="py-2 px-3 rounded text-xs font-mono font-bold border border-[#263A30] bg-[#101F18] text-[#8C9F92] hover:text-[#E8F0EB] hover:bg-[#162A20] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={13} />
                    DISMISS LEAD
                  </button>
                </div>

                <button
                  onClick={() => lab.linkListingToIncident(selectedListing.id)}
                  className="w-full py-2.5 px-3 rounded text-xs font-mono font-bold bg-[#55D6A3] text-[#07110E] hover:bg-[#48be8f] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_-3px_rgba(85,214,163,0.4)]"
                >
                  <LinkIcon size={14} />
                  LINK TO FIELD INCIDENT (CREATE CASE)
                </button>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-[#8C9F92]">
              Select a listing from the table to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

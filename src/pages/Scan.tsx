import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Loader2, Clock, ArrowRight, Plus, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { AgentActionRow } from "@/components/shared/AgentAction";

const orgTypes = ["NGO / Non-profit", "SME / Startup", "Educational institution", "Research / University", "Public Sector"];
const domains = ["Digital / AI / Tech", "Education / Training", "Innovation / R&D", "Environment / Climate", "Health / Social", "Culture / Creative", "Agriculture / Rural"];
const budgetRanges = ["Up to €100K", "€100K – €500K", "€500K – €2M", "€2M – €5M", "€5M+"];

interface ScanMatch {
  callId: string;
  callName: string;
  programme: string;
  fitScore: number;
  effortScore: number;
  urgency: string;
  deadline: string;
  fundingRange: string;
  geography: string;
  thematicArea: string;
  fundingType: string;
  whyItFits: string;
  whyDifficult: string;
  complexity: string;
  partnerRequired: boolean;
  recommendedAction: string;
}

interface ScanHistoryEntry {
  id: string;
  projectIntent: string;
  organizationType: string;
  primaryDomain: string;
  matchCount: number;
  topFitScore: number;
  timestamp: string;
  matches: ScanMatch[];
}

const tabs = ["New Scan", "Results", "History"];

const ScanPage = () => {
  const [activeTab, setActiveTab] = useState("New Scan");
  const [projectIntent, setProjectIntent] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [primaryDomain, setPrimaryDomain] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [budgetRange, setBudgetRange] = useState("");
  const [geography, setGeography] = useState("");
  const [grantType, setGrantType] = useState("");
  const [fundingStatus, setFundingStatus] = useState("Open Now");
  const [isScanning, setIsScanning] = useState(false);
  const [matches, setMatches] = useState<ScanMatch[]>([]);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIntent.trim() || !organizationType || !primaryDomain) {
      toast.error("Fill in all required fields");
      return;
    }

    setIsScanning(true);

    try {
      const { data, error } = await supabase.functions.invoke("funding-scan", {
        body: {
          projectIntent,
          organizationType,
          primaryDomain,
          filters: {
            budgetRange: budgetRange || undefined,
            geography: geography || undefined,
            grantType: grantType || undefined,
            fundingStatus: fundingStatus || undefined,
          },
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const results = data.matches || [];
      setMatches(results);
      setActiveTab("Results");

      // Add to history
      const entry: ScanHistoryEntry = {
        id: `scan-${Date.now()}`,
        projectIntent,
        organizationType,
        primaryDomain,
        matchCount: results.length,
        topFitScore: results[0]?.fitScore || 0,
        timestamp: new Date().toISOString(),
        matches: results,
      };
      setScanHistory(prev => [entry, ...prev]);

      toast.success(`Found ${results.length} matching calls`);
    } catch (err: any) {
      console.error("Scan failed:", err);
      toast.error(err.message || "Scan failed");
    } finally {
      setIsScanning(false);
    }
  };

  const rerunScan = (entry: ScanHistoryEntry) => {
    setProjectIntent(entry.projectIntent);
    setOrganizationType(entry.organizationType);
    setPrimaryDomain(entry.primaryDomain);
    setActiveTab("New Scan");
  };

  const viewHistoryResults = (entry: ScanHistoryEntry) => {
    setMatches(entry.matches);
    setActiveTab("Results");
  };

  return (
    <div className="p-8 max-w-[960px] mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-2">Funding Intelligence</p>
        <h1 className="ink-page-title mb-2">Scan</h1>
        <p className="text-[13px] text-muted-foreground">
          Scan 940+ active EU and national funding calls. Results feed directly into Opportunities and Workflows.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[11px] font-bold tracking-[0.08em] uppercase whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "History" && scanHistory.length > 0 && (
              <span className="ml-1.5 text-[10px] text-muted-foreground">({scanHistory.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* New Scan */}
      {activeTab === "New Scan" && (
        <form onSubmit={handleScan} className="space-y-6 max-w-[600px]">
          <div>
            <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">
              What do you want to fund?
            </label>
            <input
              type="text"
              value={projectIntent}
              onChange={e => setProjectIntent(e.target.value)}
              placeholder="e.g. AI training program for professionals"
              className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">
                Organization Type
              </label>
              <select
                value={organizationType}
                onChange={e => setOrganizationType(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[14px] text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none"
              >
                <option value="">Select type</option>
                {orgTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">
                Primary Domain
              </label>
              <select
                value={primaryDomain}
                onChange={e => setPrimaryDomain(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[14px] text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none"
              >
                <option value="">Select domain</option>
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showAdvanced ? "Hide" : "Show"} Advanced Filters
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">
                  Funding Status
                </label>
                <select
                  value={fundingStatus}
                  onChange={e => setFundingStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[14px] text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none"
                >
                  <option value="Open Now">Open Now</option>
                  <option value="Forthcoming">Forthcoming</option>
                  <option value="All">All</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">
                  Grant Type
                </label>
                <select
                  value={grantType}
                  onChange={e => setGrantType(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[14px] text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none"
                >
                  <option value="">All types</option>
                  <option value="Direct call for proposals">Direct call for proposals</option>
                  <option value="Cooperation Partnership">Cooperation Partnership</option>
                  <option value="RIA">RIA</option>
                  <option value="CSA">CSA</option>
                  <option value="National Grant">National Grant</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">
                  Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={e => setBudgetRange(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[14px] text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none"
                >
                  <option value="">Any budget</option>
                  {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">
                  Geography
                </label>
                <select
                  value={geography}
                  onChange={e => setGeography(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[14px] text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none"
                >
                  <option value="">Any geography</option>
                  <option value="EU-wide">EU-wide</option>
                  <option value="National">National</option>
                  <option value="Widening Countries">Widening Countries</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isScanning}
            className="w-full py-3.5 bg-foreground text-background text-[13px] font-bold tracking-wide rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning 940+ calls…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Scan Opportunities
              </>
            )}
          </button>

          <p className="text-[11px] text-muted-foreground text-center">
            Real EU data · Results saved to your scan history
          </p>
        </form>
      )}

      {/* Results */}
      {activeTab === "Results" && (
        <div>
          {matches.length === 0 ? (
            <div className="py-20 text-center">
              <Search className="h-5 w-5 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-[13px] text-muted-foreground mb-2">No scan results yet</p>
              <button
                onClick={() => setActiveTab("New Scan")}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Run a new scan
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-muted-foreground">
                  {matches.length} calls matched · Ranked by fit score
                </p>
                <AgentActionRow
                  actions={[
                    { label: "Refine matching", variant: "strategic" },
                    { label: "Compare top 3", variant: "knowledge" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                {matches.map((match, i) => (
                  <div key={match.callId} className="border border-border rounded-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedResult(expandedResult === i ? null : i)}
                      className="w-full px-5 py-3.5 text-left hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground/50" style={{ fontVariantNumeric: 'tabular-nums' }}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{match.programme}</span>
                            {match.partnerRequired && (
                              <span className="text-[9px] text-warning font-bold tracking-wider uppercase">Partner</span>
                            )}
                          </div>
                          <p className="text-[13px] font-semibold text-foreground">{match.callName}</p>
                        </div>
                        <div className="flex items-center gap-5 shrink-0">
                          <div className="text-right">
                            <p className="text-[18px] font-bold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{match.fitScore}%</p>
                            <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">Fit</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{match.deadline}</p>
                            <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">Deadline</p>
                          </div>
                          <StatusChip status={match.urgency} />
                        </div>
                      </div>
                    </button>

                    {expandedResult === i && (
                      <div className="px-5 pb-4 pt-0 border-t border-border/40">
                        <div className="grid grid-cols-4 gap-4 py-3 mb-3">
                          <MiniStat label="Budget" value={match.fundingRange} />
                          <MiniStat label="Effort" value={`${match.effortScore}/100`} />
                          <MiniStat label="Type" value={match.fundingType} />
                          <MiniStat label="Complexity" value={match.complexity} />
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-[12px] text-foreground/75 leading-relaxed">
                            <span className="font-semibold text-foreground">Why it fits:</span> {match.whyItFits}
                          </p>
                          <p className="text-[12px] text-foreground/75 leading-relaxed">
                            <span className="font-semibold text-foreground">Challenges:</span> {match.whyDifficult}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toast.success(`${match.callName} saved to Opportunities`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-primary/20 bg-primary/[0.03] text-[11px] font-bold tracking-wide text-foreground hover:border-primary/40 hover:bg-primary/[0.06] transition-all active:scale-[0.97]"
                          >
                            <Plus className="h-3 w-3" /> Save to Opportunities
                          </button>
                          <button
                            onClick={() => toast.info(`${match.callName} added to Watchlist`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold tracking-wide text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-[0.97]"
                          >
                            Add to Watchlist
                          </button>
                          <button
                            onClick={() => toast.info("Start Workflow — available in production")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold tracking-wide text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-[0.97]"
                          >
                            <ArrowRight className="h-3 w-3" /> Start Workflow
                          </button>
                          <button
                            onClick={() => toast.info(`${match.callName} ignored`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold tracking-wide text-muted-foreground/50 hover:text-muted-foreground transition-all active:scale-[0.97] ml-auto"
                          >
                            Ignore
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* History */}
      {activeTab === "History" && (
        <div>
          {scanHistory.length === 0 ? (
            <div className="py-20 text-center">
              <Clock className="h-5 w-5 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-[13px] text-muted-foreground mb-2">No scan history yet</p>
              <button
                onClick={() => setActiveTab("New Scan")}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Run your first scan
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {scanHistory.map(entry => (
                <div key={entry.id} className="flex items-center justify-between px-5 py-3.5 border border-border rounded-sm hover:bg-secondary/20 transition-colors">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{entry.projectIntent}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {entry.organizationType} · {entry.primaryDomain} · {entry.matchCount} matches · Top fit: {entry.topFitScore}%
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => viewHistoryResults(entry)}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => rerunScan(entry)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">{label}</p>
      <p className="text-[12px] font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

export default ScanPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, Lock, ArrowRight, Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StatusChip } from "@/components/shared/StatusChip";
import { ReadinessBar } from "@/components/shared/ScoreBadge";

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

const PublicScan = () => {
  const navigate = useNavigate();
  const [projectIntent, setProjectIntent] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [primaryDomain, setPrimaryDomain] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [budgetRange, setBudgetRange] = useState("");
  const [geography, setGeography] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [matches, setMatches] = useState<ScanMatch[]>([]);
  const [email, setEmail] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIntent.trim() || !organizationType || !primaryDomain) {
      toast.error("Fill in all required fields");
      return;
    }

    setIsScanning(true);
    setShowResults(false);

    try {
      const { data, error } = await supabase.functions.invoke("funding-scan", {
        body: {
          projectIntent,
          organizationType,
          primaryDomain,
          filters: {
            budgetRange: budgetRange || undefined,
            geography: geography || undefined,
          },
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setMatches(data.matches || []);
      setShowResults(true);
    } catch (err: any) {
      console.error("Scan failed:", err);
      toast.error(err.message || "Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const freeMatches = matches.slice(0, 3);
  const lockedCount = Math.max(0, matches.length - 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-[11px] font-extrabold text-primary-foreground tracking-tighter">IN</span>
            </div>
            <span className="font-extrabold text-foreground tracking-[-0.04em] text-[15px]">INK</span>
          </div>
          <button
            onClick={() => navigate("/auth")}
            className="text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </button>
        </div>
      </header>

      <div className="max-w-[960px] mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-12">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-4">Free Funding Scan</p>
          <h1 className="text-[32px] font-extrabold text-foreground tracking-[-0.03em] leading-[1.15] mb-3">
            Check your funding opportunities<br />in 60 seconds.
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[520px]">
            INK scans 940+ active EU and national funding calls and surfaces the ones that match your project. No account required.
          </p>
        </div>

        {/* Scan Form */}
        {!showResults && (
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
              Free · No account required · Real EU data
            </p>
          </form>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-primary mb-1">Scan Results</p>
                <p className="text-[14px] text-muted-foreground">
                  {matches.length} calls matched for "{projectIntent}"
                </p>
              </div>
              <button
                onClick={() => { setShowResults(false); setMatches([]); }}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                New Scan
              </button>
            </div>

            {/* Free results */}
            <div className="space-y-3">
              {freeMatches.map((match, i) => (
                <ScanResultCard key={match.callId} match={match} index={i} />
              ))}
            </div>

            {/* Locked results + CTA */}
            {lockedCount > 0 && (
              <div className="border border-border rounded-sm overflow-hidden">
                {/* Locked preview rows */}
                {matches.slice(3, 5).map((match, i) => (
                  <div key={match.callId} className="px-6 py-4 border-b border-border/40 relative">
                    <div className="blur-[6px] select-none pointer-events-none">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{match.callName}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{match.programme} · {match.geography}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[13px] font-bold">{match.fitScore}%</span>
                          <span className="text-[11px] text-muted-foreground">{match.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  </div>
                ))}

                {/* Unlock CTA */}
                <div className="px-8 py-10 bg-secondary/30 text-center">
                  <Lock className="h-5 w-5 text-foreground mx-auto mb-4" />
                  <h3 className="text-[18px] font-bold text-foreground tracking-tight mb-2">
                    Unlock {lockedCount} more matches & full platform access
                  </h3>
                  <p className="text-[13px] text-muted-foreground max-w-[420px] mx-auto mb-6 leading-relaxed">
                    Enter your email to see all matched opportunities, get full application checklists, and access the INK Application Builder.
                  </p>
                  <div className="flex gap-3 max-w-[400px] mx-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="flex-1 px-4 py-3 bg-background border border-border rounded-sm text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                    />
                    <button
                      onClick={() => navigate(`/auth?email=${encodeURIComponent(email)}`)}
                      className="px-6 py-3 bg-foreground text-background text-[13px] font-bold tracking-wide rounded-sm hover:bg-foreground/90 transition-colors flex items-center gap-2 active:scale-[0.98] whitespace-nowrap"
                    >
                      Unlock Platform
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Shield className="h-3 w-3" /> Free 14-day trial
                    </span>
                    <span className="text-[11px] text-muted-foreground">No credit card required</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function ScanResultCard({ match, index }: { match: ScanMatch; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 text-left hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-primary tracking-wider">#{index + 1}</span>
              <span className="text-[10px] text-muted-foreground">{match.programme}</span>
            </div>
            <p className="text-[14px] font-semibold text-foreground leading-snug">{match.callName}</p>
            <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1">{match.whyItFits}</p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">Fit</p>
              <p className="text-[18px] font-bold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{match.fitScore}%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">Deadline</p>
              <p className="text-[13px] font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{match.deadline}</p>
            </div>
            <StatusChip status={match.urgency} />
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-6 pb-5 pt-0 border-t border-border/40">
          <div className="grid grid-cols-4 gap-4 py-3 mb-3">
            <MiniStat label="Budget" value={match.fundingRange} />
            <MiniStat label="Effort" value={`${match.effortScore}/100`} />
            <MiniStat label="Type" value={match.fundingType} />
            <MiniStat label="Complexity" value={match.complexity} />
          </div>
          <div className="space-y-2">
            <p className="text-[12px] text-foreground/75 leading-relaxed"><span className="font-semibold text-foreground">Why it fits:</span> {match.whyItFits}</p>
            <p className="text-[12px] text-foreground/75 leading-relaxed"><span className="font-semibold text-foreground">Challenges:</span> {match.whyDifficult}</p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground tracking-wide uppercase">Recommended</span>
              <StatusChip status={match.recommendedAction.toLowerCase().replace(/ /g, '-')} />
            </div>
            {match.partnerRequired && (
              <span className="text-[10px] text-warning font-semibold uppercase tracking-wider">Partner required</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">{label}</p>
      <p className="text-[12px] font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

export default PublicScan;

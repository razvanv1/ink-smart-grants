import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, Lock, ArrowRight, Loader2, Shield, AlertTriangle, Clock, Users, TrendingUp, Zap, Target, FileCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import inkMascot from "@/assets/ink-mascot.png";

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

  const handleUnlock = () => {
    // Save scan results + context to localStorage so in-app Scan page can pick them up
    localStorage.setItem("ink_pending_scan", JSON.stringify({
      matches,
      projectIntent,
      organizationType,
      primaryDomain,
      timestamp: new Date().toISOString(),
    }));
    navigate(`/auth?email=${encodeURIComponent(email)}&redirect=/scan?fromPublic=true`);
  };

  const freeMatches = matches.slice(0, 3);
  const lockedCount = Math.max(0, matches.length - 3);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Geometric background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-primary/[0.06]" />
        <div className="absolute -top-16 -right-16 w-[320px] h-[320px] rounded-full border border-primary/[0.04]" />
        <div className="absolute top-[60%] -left-24 w-[200px] h-[200px] bg-primary/[0.03] rounded-[3px] rotate-12" />
        <div className="absolute bottom-32 right-[10%] w-[120px] h-[120px] border border-border/40 rounded-[3px] rotate-[22deg]" />
        <div className="absolute top-[30%] right-[5%] w-[64px] h-[64px] bg-primary/[0.05] rounded-full" />
        <div className="absolute bottom-[15%] left-[8%] w-[80px] h-[3px] bg-primary/[0.12] rotate-[-30deg]" />
        <div className="absolute top-[20%] left-[15%] w-[3px] h-[60px] bg-primary/[0.08]" />
      </div>

      {/* Header */}
      <header className="border-b border-border/60 relative">
        <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 bg-primary rounded-[3px] flex items-center justify-center">
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

      <div className="max-w-[960px] mx-auto px-6 py-16 relative">
        {/* Hero */}
        <section className="mb-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[3px] border border-primary/20 bg-primary/[0.06] px-3.5 py-1.5 mb-6">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-[11px] font-bold text-primary tracking-wide uppercase">Free Funding Scan</span>
              </div>

              <h1 className="text-[42px] font-extrabold text-foreground tracking-[-0.04em] leading-[1.05] mb-5">
                Find the right<br />
                <span className="text-primary">funding calls</span> before<br />
                your deadline slips.
              </h1>

              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[480px] mb-8">
                INK scans live EU and national opportunities, ranks the best matches
                for your project, and gives you clear next steps — no account required.
              </p>

              {/* Value props with geometric accent */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="border border-border rounded-[3px] p-3.5 bg-card">
                  <div className="h-8 w-8 rounded-[3px] bg-primary/[0.08] flex items-center justify-center mb-2.5">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[20px] font-extrabold text-foreground leading-none mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>940+</p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Active calls</p>
                </div>
                <div className="border border-border rounded-[3px] p-3.5 bg-card">
                  <div className="h-8 w-8 rounded-[3px] bg-primary/[0.08] flex items-center justify-center mb-2.5">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[20px] font-extrabold text-foreground leading-none mb-1">3</p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Free matches</p>
                </div>
                <div className="border border-border rounded-[3px] p-3.5 bg-card">
                  <div className="h-8 w-8 rounded-[3px] bg-primary/[0.08] flex items-center justify-center mb-2.5">
                    <FileCheck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[20px] font-extrabold text-foreground leading-none mb-1">60s</p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">To results</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary/60" />
                  No card required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary/60" />
                  Used by early-access funding teams
                </span>
              </div>
            </div>

            {/* Right side: Mascot + preview card */}
            <div className="relative flex flex-col items-center">
              <img
                src={inkMascot}
                alt="INK mascot — an octopus that can handle 8 grants at once"
                className="w-[220px] h-auto mb-4 drop-shadow-lg"
              />

              {/* Preview card under mascot */}
              <div className="w-full relative overflow-hidden rounded-[6px] border border-border bg-card p-4 shadow-sm">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-primary mb-3">What you get in 60s</p>
                <div className="space-y-2.5">
                  <div className="rounded-[4px] border border-border bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold text-foreground">EIC Accelerator — Digital Infrastructure</p>
                      <span className="text-[11px] font-extrabold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>91%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">High fit · Deadline: 24 days</p>
                  </div>
                  <div className="rounded-[4px] border border-border bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold text-foreground">Erasmus+ Alliances for Innovation</p>
                      <span className="text-[11px] font-extrabold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>84%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Strong training match · Consortium required</p>
                  </div>
                  <div className="rounded-[4px] border border-dashed border-primary/30 bg-primary/[0.04] px-3 py-2.5">
                    <p className="text-[10px] font-semibold text-foreground">+ 5 more matches after unlock</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Free 14-day trial · No credit card</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scan Form */}
        {!showResults && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Start Your Scan</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleScan} className="space-y-6 max-w-[600px] mx-auto">
              <div>
                <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">
                  What do you want to fund?
                </label>
                <input
                  type="text"
                  value={projectIntent}
                  onChange={e => setProjectIntent(e.target.value)}
                  placeholder="e.g. AI training program for professionals"
                  className="w-full px-4 py-3.5 bg-background border border-border rounded-[3px] text-[14px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
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
                    className="w-full px-4 py-3.5 bg-background border border-border rounded-[3px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
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
                    className="w-full px-4 py-3.5 bg-background border border-border rounded-[3px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
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
                      className="w-full px-4 py-3.5 bg-background border border-border rounded-[3px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
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
                      className="w-full px-4 py-3.5 bg-background border border-border rounded-[3px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
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
                className="w-full py-4 bg-primary text-primary-foreground text-[13px] font-bold tracking-wide rounded-[3px] hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 active:scale-[0.98] shadow-sm shadow-primary/20"
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

              <p className="text-[11px] text-muted-foreground/60 text-center">
                Free · No account required · Real EU data
              </p>
            </form>
          </section>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-1">Scan Results</p>
                <p className="text-[24px] font-extrabold text-foreground tracking-tight">
                  {matches.length} calls matched
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  for "{projectIntent}"
                </p>
              </div>
              <button
                onClick={() => { setShowResults(false); setMatches([]); }}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                New Scan
              </button>
            </div>

            {/* Free results — rich cards */}
            <div className="space-y-4">
              {freeMatches.map((match, i) => (
                <FreeResultCard key={match.callId} match={match} index={i} />
              ))}
            </div>

            {/* Locked results + Unlock CTA */}
            {lockedCount > 0 && (
              <div className="border border-border rounded-[4px] overflow-hidden">
                {/* Locked preview rows */}
                {matches.slice(3, 6).map((match) => (
                  <div key={match.callId} className="px-6 py-4 border-b border-border/30 relative">
                    <div className="blur-[6px] select-none pointer-events-none">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{match.callName}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{match.programme}</p>
                        </div>
                        <span className="text-[13px] font-bold">{match.fitScore}%</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground/30" />
                    </div>
                  </div>
                ))}

                {/* Unlock CTA */}
                <div className="px-8 py-14 text-center bg-gradient-to-b from-transparent to-primary/[0.03]">
                  <img src={inkMascot} alt="" className="h-16 w-auto mx-auto mb-5 opacity-80" />
                  <h3 className="text-[22px] font-extrabold text-foreground tracking-[-0.02em] mb-2">
                    Unlock {lockedCount} more matches & full platform access
                  </h3>
                  <p className="text-[13px] text-muted-foreground max-w-[440px] mx-auto mb-8 leading-relaxed">
                    Enter your email to see all your matched opportunities, get the full application checklists, and access the INK Application Builder.
                  </p>
                  <div className="flex gap-3 max-w-[420px] mx-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="flex-1 px-4 py-3 bg-background border border-border rounded-[3px] text-[14px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                    <button
                      onClick={handleUnlock}
                      className="px-6 py-3 bg-primary text-primary-foreground text-[13px] font-bold tracking-wide rounded-[3px] hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-[0.98] whitespace-nowrap shadow-sm shadow-primary/20"
                    >
                      Unlock Platform
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 mt-5">
                    Free 14-day trial · No credit card required
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Rich free result card ── */

function FreeResultCard({ match, index }: { match: ScanMatch; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const daysLeft = (() => {
    try {
      const d = new Date(match.deadline);
      const now = new Date();
      return Math.max(0, Math.ceil((d.getTime() - now.getTime()) / 86400000));
    } catch { return null; }
  })();

  const deadlineUrgent = daysLeft !== null && daysLeft <= 30;

  return (
    <div className="border border-border rounded-[4px] overflow-hidden hover:border-primary/20 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-5 text-left hover:bg-primary/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[10px] font-extrabold text-primary/40 tracking-wider">#{index + 1}</span>
              <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">{match.programme}</span>
            </div>
            <p className="text-[15px] font-bold text-foreground leading-snug tracking-[-0.01em]">{match.callName}</p>
          </div>
          <div className="flex items-center gap-6 shrink-0 pt-1">
            <div className="text-right">
              <p className="text-[9px] text-muted-foreground tracking-[0.12em] uppercase mb-0.5">Fit</p>
              <p className="text-[20px] font-extrabold text-primary leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>{match.fitScore}%</p>
            </div>
            {daysLeft !== null && (
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground tracking-[0.12em] uppercase mb-0.5">Deadline</p>
                <p className={`text-[13px] font-bold leading-none ${deadlineUrgent ? 'text-destructive' : 'text-foreground'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {daysLeft}d left
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <SignalChip icon={<TrendingUp className="h-3 w-3" />} text={match.whyItFits} variant="positive" />
          {match.whyDifficult && (
            <SignalChip icon={<AlertTriangle className="h-3 w-3" />} text={match.whyDifficult} variant="warning" />
          )}
          {match.partnerRequired && (
            <SignalChip icon={<Users className="h-3 w-3" />} text="Consortium likely required" variant="neutral" />
          )}
          {deadlineUrgent && (
            <SignalChip icon={<Clock className="h-3 w-3" />} text={`Deadline in ${daysLeft} days`} variant="urgent" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-5 pt-0 border-t border-border/30">
          <div className="grid grid-cols-4 gap-4 py-4 mb-3">
            <MiniStat label="Budget" value={match.fundingRange} />
            <MiniStat label="Effort" value={`${match.effortScore}/100`} />
            <MiniStat label="Type" value={match.fundingType} />
            <MiniStat label="Complexity" value={match.complexity} />
          </div>
          <div className="space-y-2.5">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Why it fits — </span>{match.whyItFits}
            </p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Key challenge — </span>{match.whyDifficult}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Next step:</span> {match.recommendedAction}
            </p>
            <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
              {match.geography}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Signal chip ── */

function SignalChip({ icon, text, variant }: { icon: React.ReactNode; text: string; variant: 'positive' | 'warning' | 'urgent' | 'neutral' }) {
  const styles = {
    positive: 'text-emerald-700 bg-emerald-50',
    warning: 'text-amber-700 bg-amber-50',
    urgent: 'text-destructive bg-destructive/8',
    neutral: 'text-muted-foreground bg-secondary',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-[11px] font-medium leading-none ${styles[variant]}`}>
      {icon}
      <span className="truncate max-w-[200px]">{text}</span>
    </span>
  );
}

/* ── Mini stat ── */

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-muted-foreground tracking-[0.12em] uppercase mb-0.5">{label}</p>
      <p className="text-[12px] font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default PublicScan;

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, Lock, ArrowRight, Loader2, AlertTriangle, Clock, Users, TrendingUp, Sparkles, FileText, Target, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import inkLogo from "@/assets/ink-octopus-logo.png";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { TypewriterText } from "@/components/landing/TypewriterText";
import { PricingSection } from "@/components/landing/PricingSection";

const orgTypes = ["NGO / Non-profit", "SME / Startup", "Educational institution", "Research / University", "Public Sector"];
const domains = ["Digital / AI / Tech", "Education / Training", "Innovation / R&D", "Environment / Climate", "Health / Social", "Culture / Creative", "Agriculture / Rural"];
const budgetRanges = ["Up to €100K", "€100K – €500K", "€500K – €2M", "€2M – €5M", "€5M+"];

interface ScanMatch {
  callId: string; callName: string; programme: string; fitScore: number; effortScore: number;
  urgency: string; deadline: string; fundingRange: string; geography: string; thematicArea: string;
  fundingType: string; whyItFits: string; whyDifficult: string; complexity: string;
  partnerRequired: boolean; recommendedAction: string;
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
  const resultsRef = useRef<HTMLDivElement>(null);

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
        body: { projectIntent, organizationType, primaryDomain, filters: { budgetRange: budgetRange || undefined, geography: geography || undefined } },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      setMatches(data.matches || []);
      setShowResults(true);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err: any) {
      console.error("Scan failed:", err);
      toast.error(err.message || "Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleUnlock = () => {
    localStorage.setItem("ink_pending_scan", JSON.stringify({
      matches, projectIntent, organizationType, primaryDomain, timestamp: new Date().toISOString(),
    }));
    navigate(`/auth?email=${encodeURIComponent(email)}&redirect=/scan?fromPublic=true`);
  };

  const freeMatches = matches.slice(0, 3);
  const lockedCount = Math.max(0, matches.length - 3);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <LandingHeader />

      {/* ═══ HERO — light, high-contrast geometry ═══ */}
      <section className="relative pt-14 overflow-hidden">
        {/* Geometric accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-info/[0.10] via-secondary/70 to-transparent" />
          <div className="absolute top-16 -left-24 w-[520px] h-[520px] rounded-full border-2 border-info/20" />
          <div className="absolute top-24 -left-2 w-[360px] h-[360px] rounded-full border border-foreground/12" />
          <div className="absolute -top-10 right-[8%] w-[220px] h-[220px] bg-info/12 rounded-[10px] rotate-[16deg] shadow-xl shadow-info/10" />
          <div className="absolute top-[38%] right-[5%] w-[160px] h-[160px] border-2 border-info/25 rounded-[8px] rotate-[10deg]" />
          <div className="absolute bottom-36 left-[14%] w-[120px] h-[4px] bg-foreground/25 rotate-[-22deg]" />
          <div className="absolute top-[24%] left-[43%] w-[4px] h-[96px] bg-info/25" />
        </div>

        <div className="relative max-w-[1080px] mx-auto px-6 pt-24 pb-20">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-[3px] border border-info/30 bg-info/[0.10] px-4 py-2 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <Sparkles className="h-3.5 w-3.5 text-info" />
                <span className="text-[11px] font-bold text-info tracking-wide uppercase">Free Funding Scan — No Account Required</span>
              </div>

              <h1 className="text-[44px] lg:text-[52px] font-extrabold text-foreground tracking-[-0.045em] leading-[1.05] mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
                Find funding for<br />
                <TypewriterText
                  phrases={["AI training programs", "green energy projects", "digital innovation labs", "research consortiums", "social impact startups"]}
                  className="text-info"
                />
              </h1>

              <p className="text-[16px] text-foreground/80 leading-relaxed max-w-[500px] mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                INK scans 940+ live EU and national funding calls, matches them to your project, and shows you exactly why each one fits — in under 60 seconds.
              </p>

              {/* Stat blocks */}
              <div className="grid grid-cols-3 gap-4 max-w-[420px] opacity-0 animate-fade-in-up" style={{ animationDelay: "0.55s" }}>
                <StatBlock number="940+" label="Active calls" />
                <StatBlock number="3" label="Free matches" />
                <StatBlock number="60s" label="To results" />
              </div>
            </div>

            {/* Right: Octopus logo + How it works */}
            <div className="relative flex flex-col items-center opacity-0 animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <div className="animate-float mb-8">
                <img
                  src={inkLogo}
                  alt="INK — agentic funding platform"
                  className="w-[180px] lg:w-[220px] h-auto drop-shadow-lg"
                />
              </div>

              {/* How it works — 3 steps */}
              <div className="w-full max-w-[320px] space-y-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-info mb-1">How it works</p>
                <HowItWorksStep step={1} icon={<FileText className="h-4 w-4" />} title="Describe your project" description="Tell us what you want to fund in one sentence" />
                <HowItWorksStep step={2} icon={<Target className="h-4 w-4" />} title="Get matched calls" description="AI matches your profile against 940+ live calls" />
                <HowItWorksStep step={3} icon={<Zap className="h-4 w-4" />} title="Start your application" description="Turn the best match into an active workflow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCAN FORM + RESULTS ═══ */}
      <div className="max-w-[1080px] mx-auto px-6">
        {!showResults && (
          <section className="relative z-10 mb-20">
            <div className="max-w-[640px] mx-auto bg-card rounded-[8px] border border-border shadow-xl shadow-foreground/[0.08] p-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-[4px] bg-info/12 flex items-center justify-center">
                  <Search className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground">Start Your Free Scan</p>
                  <p className="text-[11px] text-foreground/70">Describe your project and we'll match relevant calls</p>
                </div>
              </div>

              <form onSubmit={handleScan} className="space-y-5">
                <div>
                  <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">What do you want to fund?</label>
                  <input type="text" value={projectIntent} onChange={e => setProjectIntent(e.target.value)} placeholder="e.g. AI training program for professionals" className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-foreground/45 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Organization Type</label>
                    <select value={organizationType} onChange={e => setOrganizationType(e.target.value)} className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                      <option value="">Select type</option>
                      {orgTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Primary Domain</label>
                    <select value={primaryDomain} onChange={e => setPrimaryDomain(e.target.value)} className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                      <option value="">Select domain</option>
                      {domains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/75 hover:text-foreground transition-colors">
                  {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showAdvanced ? "Hide" : "Show"} Advanced Filters
                </button>
                {showAdvanced && (
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Budget Range</label>
                      <select value={budgetRange} onChange={e => setBudgetRange(e.target.value)} className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                        <option value="">Any budget</option>
                        {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Geography</label>
                      <select value={geography} onChange={e => setGeography(e.target.value)} className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                        <option value="">Any geography</option>
                        <option value="EU-wide">EU-wide</option>
                        <option value="National">National</option>
                        <option value="Widening Countries">Widening Countries</option>
                      </select>
                    </div>
                  </div>
                )}
                <button type="submit" disabled={isScanning} className="w-full py-4 bg-info text-info-foreground text-[14px] font-bold tracking-wide rounded-[4px] hover:bg-info/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 active:scale-[0.97] shadow-md shadow-info/20">
                  {isScanning ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning 940+ calls…</> : <><Search className="h-4 w-4" /> Scan Opportunities</>}
                </button>
                <p className="text-[11px] text-foreground/60 text-center">Free · No account required · Real EU data</p>
              </form>
            </div>
          </section>
        )}

        {/* ═══ RESULTS ═══ */}
        {showResults && (
          <div ref={resultsRef} className="space-y-8 relative z-10 mb-20">
            <div className="flex items-center justify-between opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-info mb-1">Scan Results</p>
                <p className="text-[26px] font-extrabold text-foreground tracking-tight">{matches.length} calls matched</p>
                <p className="text-[13px] text-foreground/70 mt-0.5">for "{projectIntent}"</p>
              </div>
              <button onClick={() => { setShowResults(false); setMatches([]); }} className="text-[11px] font-semibold text-foreground/75 hover:text-foreground transition-colors px-3 py-1.5 rounded-[3px] border border-border hover:border-foreground/30">New Scan</button>
            </div>

            <div className="space-y-4">
              {freeMatches.map((match, i) => (
                <div key={match.callId} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                  <FreeResultCard match={match} index={i} />
                </div>
              ))}
            </div>

            {lockedCount > 0 && (
              <div className="border border-border rounded-[6px] overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                {matches.slice(3, 6).map((match) => (
                  <div key={match.callId} className="px-6 py-4 border-b border-border/30 relative">
                    <div className="blur-[4px] select-none pointer-events-none">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{match.callName}</p>
                          <p className="text-[11px] text-foreground/65 mt-0.5">{match.programme}</p>
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
                <div className="px-8 py-16 text-center bg-gradient-to-b from-card to-info/[0.08]">
                  <div className="animate-float inline-block mb-6">
                    <img src={inkLogo} alt="" className="h-20 w-auto" />
                  </div>
                  <h3 className="text-[24px] font-extrabold text-foreground tracking-[-0.03em] mb-3">
                    Unlock {lockedCount} more matches & full platform
                  </h3>
                  <p className="text-[14px] text-muted-foreground max-w-[460px] mx-auto mb-8 leading-relaxed">
                    See all matched opportunities, get application checklists, and access the INK Application Builder.
                  </p>
                  <div className="flex gap-3 max-w-[440px] mx-auto">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-foreground/45 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all" />
                    <button onClick={handleUnlock} className="px-7 py-3.5 bg-info text-info-foreground text-[13px] font-bold tracking-wide rounded-[4px] hover:bg-info/90 transition-all flex items-center gap-2.5 active:scale-[0.97] whitespace-nowrap shadow-md shadow-info/20">
                      Unlock Platform <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-foreground/60 mt-5">Free 14-day trial · No credit card required</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ PRICING ═══ */}
        <PricingSection />

        {/* ═══ FOOTER ═══ */}
        <footer className="py-12 border-t border-border/40 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img src={inkLogo} alt="INK" className="h-8 w-8 object-contain" />
            <span className="font-extrabold text-foreground tracking-[-0.04em] text-[15px]">INK</span>
          </div>
          <p className="text-[11px] text-foreground/65">© {new Date().getFullYear()} INK. Agentic funding operations platform.</p>
        </footer>
      </div>
    </div>
  );
};

/* ── How It Works step ── */
function HowItWorksStep({ step, icon, title, description }: { step: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-[6px] border border-border bg-card hover:border-info/40 hover:shadow-sm hover:shadow-info/10 transition-all duration-200">
      <div className="h-8 w-8 rounded-[4px] bg-info/12 flex items-center justify-center shrink-0 text-info">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-bold text-foreground leading-snug">{title}</p>
        <p className="text-[11px] text-foreground/70 leading-relaxed mt-0.5">{description}</p>
      </div>
      <span className="text-[10px] font-extrabold text-info/55 shrink-0 pt-0.5">{step}</span>
    </div>
  );
}

/* ── Stat block for hero ── */
function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-3 rounded-[6px] border border-foreground/15 bg-background shadow-sm">
      <p className="text-[24px] font-extrabold text-foreground leading-none mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>{number}</p>
      <p className="text-[10px] text-foreground/65 font-semibold uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ── Rich free result card ── */
function FreeResultCard({ match, index }: { match: ScanMatch; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const daysLeft = (() => {
    try { return Math.max(0, Math.ceil((new Date(match.deadline).getTime() - Date.now()) / 86400000)); } catch { return null; }
  })();
  const deadlineUrgent = daysLeft !== null && daysLeft <= 30;

  return (
    <div className="border border-border rounded-[6px] overflow-hidden hover:border-info/45 hover:shadow-md hover:shadow-info/[0.08] transition-all duration-300 bg-card">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-6 py-5 text-left hover:bg-info/[0.05] transition-colors">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[10px] font-extrabold text-info/65 tracking-wider">#{index + 1}</span>
              <span className="text-[10px] font-semibold text-foreground/65 tracking-wide uppercase">{match.programme}</span>
            </div>
            <p className="text-[15px] font-bold text-foreground leading-snug tracking-[-0.01em]">{match.callName}</p>
          </div>
          <div className="flex items-center gap-6 shrink-0 pt-1">
            <div className="text-right">
              <p className="text-[9px] text-foreground/60 tracking-[0.12em] uppercase mb-0.5">Fit</p>
              <p className="text-[22px] font-extrabold text-info leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{match.fitScore}%</p>
            </div>
            {daysLeft !== null && (
              <div className="text-right">
                <p className="text-[9px] text-foreground/60 tracking-[0.12em] uppercase mb-0.5">Deadline</p>
                <p className={`text-[13px] font-bold leading-none ${deadlineUrgent ? "text-destructive" : "text-foreground"}`} style={{ fontVariantNumeric: "tabular-nums" }}>{daysLeft}d left</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <SignalChip icon={<TrendingUp className="h-3 w-3" />} text={match.whyItFits} variant="positive" />
          {match.whyDifficult && <SignalChip icon={<AlertTriangle className="h-3 w-3" />} text={match.whyDifficult} variant="warning" />}
          {match.partnerRequired && <SignalChip icon={<Users className="h-3 w-3" />} text="Consortium likely required" variant="neutral" />}
          {deadlineUrgent && <SignalChip icon={<Clock className="h-3 w-3" />} text={`Deadline in ${daysLeft} days`} variant="urgent" />}
        </div>
      </button>
      {expanded && (
        <div className="px-6 pb-5 pt-0 border-t border-border/30 animate-fade-in">
          <div className="grid grid-cols-4 gap-4 py-4 mb-3">
            <MiniStat label="Budget" value={match.fundingRange} />
            <MiniStat label="Effort" value={`${match.effortScore}/100`} />
            <MiniStat label="Type" value={match.fundingType} />
            <MiniStat label="Complexity" value={match.complexity} />
          </div>
          <div className="space-y-2.5">
            <p className="text-[12px] text-foreground/75 leading-relaxed"><span className="font-semibold text-foreground">Why it fits — </span>{match.whyItFits}</p>
            <p className="text-[12px] text-foreground/75 leading-relaxed"><span className="font-semibold text-foreground">Key challenge — </span>{match.whyDifficult}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
            <p className="text-[11px] text-foreground/70"><span className="font-semibold text-foreground">Next step:</span> {match.recommendedAction}</p>
            <span className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider">{match.geography}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SignalChip({ icon, text, variant }: { icon: React.ReactNode; text: string; variant: "positive" | "warning" | "urgent" | "neutral" }) {
  const styles = {
    positive: "text-success bg-success/15 border border-success/30",
    warning: "text-foreground bg-warning/20 border border-warning/35",
    urgent: "text-destructive bg-destructive/10 border border-destructive/30",
    neutral: "text-foreground/80 bg-secondary border border-border",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-[11px] font-medium leading-none ${styles[variant]}`}>
      {icon}<span className="truncate max-w-[200px]">{text}</span>
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-foreground/60 tracking-[0.12em] uppercase mb-0.5">{label}</p>
      <p className="text-[12px] font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default PublicScan;

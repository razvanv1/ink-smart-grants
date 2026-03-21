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

      {/* ═══ HERO — light, geometric, premium ═══ */}
      <section className="relative pt-14 overflow-hidden">
        {/* Geometric accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 -left-20 w-[500px] h-[500px] rounded-full border border-primary/[0.06]" />
          <div className="absolute top-32 -left-8 w-[380px] h-[380px] rounded-full border border-primary/[0.04]" />
          <div className="absolute -top-10 right-[10%] w-[200px] h-[200px] bg-primary/[0.03] rounded-[3px] rotate-[18deg]" />
          <div className="absolute top-[40%] right-[5%] w-[140px] h-[140px] border border-border/60 rounded-full" />
          <div className="absolute bottom-40 left-[15%] w-[80px] h-[3px] bg-primary/[0.12] rotate-[-25deg]" />
          <div className="absolute top-[25%] left-[40%] w-[3px] h-[80px] bg-primary/[0.08]" />
        </div>

        <div className="relative max-w-[1080px] mx-auto px-6 pt-24 pb-20">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-[3px] border border-primary/20 bg-primary/[0.06] px-4 py-2 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-bold text-primary tracking-wide uppercase">Free Funding Scan — No Account Required</span>
              </div>

              <h1 className="text-[44px] lg:text-[52px] font-extrabold text-foreground tracking-[-0.045em] leading-[1.05] mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
                Find funding for<br />
                <TypewriterText
                  phrases={["AI training programs", "green energy projects", "digital innovation labs", "research consortiums", "social impact startups"]}
                  className="text-primary"
                />
              </h1>

              <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[500px] mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
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
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-primary mb-1">How it works</p>
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
            <div className="max-w-[640px] mx-auto bg-card rounded-[8px] border border-border shadow-xl shadow-foreground/[0.03] p-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-[4px] bg-primary/10 flex items-center justify-center">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground">Start Your Free Scan</p>
                  <p className="text-[11px] text-muted-foreground">Describe your project and we'll match relevant calls</p>
                </div>
              </div>

              <form onSubmit={handleScan} className="space-y-5">
                <div>
                  <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">What do you want to fund?</label>
                  <input type="text" value={projectIntent} onChange={e => setProjectIntent(e.target.value)} placeholder="e.g. AI training program for professionals" className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Organization Type</label>
                    <select value={organizationType} onChange={e => setOrganizationType(e.target.value)} className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
                      <option value="">Select type</option>
                      {orgTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Primary Domain</label>
                    <select value={primaryDomain} onChange={e => setPrimaryDomain(e.target.value)} className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
                      <option value="">Select domain</option>
                      {domains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showAdvanced ? "Hide" : "Show"} Advanced Filters
                </button>
                {showAdvanced && (
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Budget Range</label>
                      <select value={budgetRange} onChange={e => setBudgetRange(e.target.value)} className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
                        <option value="">Any budget</option>
                        {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Geography</label>
                      <select value={geography} onChange={e => setGeography(e.target.value)} className="w-full px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
                        <option value="">Any geography</option>
                        <option value="EU-wide">EU-wide</option>
                        <option value="National">National</option>
                        <option value="Widening Countries">Widening Countries</option>
                      </select>
                    </div>
                  </div>
                )}
                <button type="submit" disabled={isScanning} className="w-full py-4 bg-primary text-primary-foreground text-[14px] font-bold tracking-wide rounded-[4px] hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 active:scale-[0.97] shadow-md shadow-primary/20">
                  {isScanning ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning 940+ calls…</> : <><Search className="h-4 w-4" /> Scan Opportunities</>}
                </button>
                <p className="text-[11px] text-muted-foreground/60 text-center">Free · No account required · Real EU data</p>
              </form>
            </div>
          </section>
        )}

        {/* ═══ RESULTS ═══ */}
        {showResults && (
          <div ref={resultsRef} className="space-y-8 relative z-10 mb-20">
            <div className="flex items-center justify-between opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-1">Scan Results</p>
                <p className="text-[26px] font-extrabold text-foreground tracking-tight">{matches.length} calls matched</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">for "{projectIntent}"</p>
              </div>
              <button onClick={() => { setShowResults(false); setMatches([]); }} className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-[3px] border border-border hover:border-foreground/20">New Scan</button>
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
                <div className="px-8 py-16 text-center bg-gradient-to-b from-card to-primary/[0.03]">
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
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
                    <button onClick={handleUnlock} className="px-7 py-3.5 bg-primary text-primary-foreground text-[13px] font-bold tracking-wide rounded-[4px] hover:bg-primary/90 transition-all flex items-center gap-2.5 active:scale-[0.97] whitespace-nowrap shadow-md shadow-primary/20">
                      Unlock Platform <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 mt-5">Free 14-day trial · No credit card required</p>
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
          <p className="text-[11px] text-muted-foreground">© {new Date().getFullYear()} INK. Agentic funding operations platform.</p>
        </footer>
      </div>
    </div>
  );
};

/* ── How It Works step ── */
function HowItWorksStep({ step, icon, title, description }: { step: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-[6px] border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200">
      <div className="h-8 w-8 rounded-[4px] bg-primary/10 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-bold text-foreground leading-snug">{title}</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{description}</p>
      </div>
      <span className="text-[10px] font-extrabold text-primary/40 shrink-0 pt-0.5">{step}</span>
    </div>
  );
}

/* ── Stat block for hero ── */
function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-3 rounded-[6px] border border-border bg-card">
      <p className="text-[24px] font-extrabold text-foreground leading-none mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>{number}</p>
      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
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
    <div className="border border-border rounded-[6px] overflow-hidden hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.04] transition-all duration-300">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-6 py-5 text-left hover:bg-primary/[0.02] transition-colors">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[10px] font-extrabold text-primary/50 tracking-wider">#{index + 1}</span>
              <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">{match.programme}</span>
            </div>
            <p className="text-[15px] font-bold text-foreground leading-snug tracking-[-0.01em]">{match.callName}</p>
          </div>
          <div className="flex items-center gap-6 shrink-0 pt-1">
            <div className="text-right">
              <p className="text-[9px] text-muted-foreground tracking-[0.12em] uppercase mb-0.5">Fit</p>
              <p className="text-[22px] font-extrabold text-primary leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{match.fitScore}%</p>
            </div>
            {daysLeft !== null && (
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground tracking-[0.12em] uppercase mb-0.5">Deadline</p>
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
            <p className="text-[12px] text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">Why it fits — </span>{match.whyItFits}</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">Key challenge — </span>{match.whyDifficult}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">Next step:</span> {match.recommendedAction}</p>
            <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">{match.geography}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SignalChip({ icon, text, variant }: { icon: React.ReactNode; text: string; variant: "positive" | "warning" | "urgent" | "neutral" }) {
  const styles = { positive: "text-emerald-700 bg-emerald-50", warning: "text-amber-700 bg-amber-50", urgent: "text-destructive bg-destructive/8", neutral: "text-muted-foreground bg-secondary" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-[11px] font-medium leading-none ${styles[variant]}`}>
      {icon}<span className="truncate max-w-[200px]">{text}</span>
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-muted-foreground tracking-[0.12em] uppercase mb-0.5">{label}</p>
      <p className="text-[12px] font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default PublicScan;

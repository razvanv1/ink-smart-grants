import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, Lock, ArrowRight, Loader2, AlertTriangle, Clock, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { TypewriterText } from "@/components/landing/TypewriterText";
import { PricingSection } from "@/components/landing/PricingSection";

import octopusImg from "@/assets/ink-octopus.webp";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Footer } from "@/components/Footer";

import { orgTypes, domains, budgetRanges, grantTypes, fundingStatuses, geographies } from "@/data/scanConfig";

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
  const [grantType, setGrantType] = useState("");
  const [fundingStatus, setFundingStatus] = useState("");
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
        body: { projectIntent, organizationType, primaryDomain, filters: { budgetRange: budgetRange || undefined, geography: geography || undefined, grantType: grantType || undefined, fundingStatus: fundingStatus || undefined } },
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
      <main>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-14 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-[700px] bg-gradient-to-b from-muted/60 via-muted/15 to-transparent" />
          <div className="absolute -top-28 right-[8%] h-[420px] w-[420px] rounded-full bg-info/10 blur-3xl" />
        </div>


        <div className="relative w-full px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-32 pt-20 sm:pt-28 lg:pt-32 pb-24 sm:pb-28 lg:pb-36">
          <div className="max-w-[1880px] mx-auto relative">
            {/* Slogan — top right corner, branded with INK */}
            <div className="absolute top-0 right-0 hidden lg:flex items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <span className="text-[18px] xl:text-[22px] font-extrabold tracking-[-0.02em] text-foreground/40 italic">"I can slap 8 grants at once."</span>
              <span className="text-[12px] font-bold text-primary/60 uppercase tracking-wider">— INK</span>
            </div>

            <button
              onClick={() => document.getElementById('scan-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-info/30 bg-info/[0.07] text-[11px] font-bold tracking-wide uppercase text-info hover:bg-info/[0.14] hover:border-info/50 active:scale-[0.96] transition-all mb-7 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Free Funding Scan · No Account Required
              <ChevronDown className="h-3 w-3" />
            </button>

            <h1
              className="text-[clamp(2.9rem,6.2vw,7.4rem)] font-extrabold text-foreground tracking-[-0.05em] mb-6 sm:mb-7 opacity-0 animate-fade-in-up max-w-[900px] xl:max-w-[1100px]"
              style={{ animationDelay: "0.2s", lineHeight: "0.97" }}
            >
              Find funding for<br />
              <TypewriterText
                phrases={["AI training programs", "green energy projects", "digital innovation labs", "research consortiums", "social impact startups"]}
                className="text-info"
              />
            </h1>

            <p className="text-[17px] sm:text-[19px] lg:text-[21px] text-foreground/70 leading-[1.7] max-w-[680px] mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
              A smart funding operations platform that monitors opportunities, selects the best grants, builds proposals faster with smart agents.
            </p>

            {/* Slogan on mobile only */}
            <p className="lg:hidden text-[16px] font-extrabold text-foreground/40 italic tracking-[-0.02em] mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              "I can slap 8 grants at once." <span className="text-[10px] not-italic font-bold text-primary/50 uppercase tracking-wider ml-1">— INK</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <button
                onClick={() => document.getElementById('scan-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="ink-glow-info px-7 py-3 bg-info text-info-foreground text-[14px] font-bold rounded-full shadow-lg shadow-info/25"
              >
                Start Scanning
              </button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-5 py-3 text-[13px] font-bold text-foreground bg-secondary hover:bg-secondary/80 rounded-full border border-border shadow-sm hover:shadow-md hover:border-foreground/20 transition-all active:scale-[0.96]"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS + SCAN FORM ═══ */}
      <div className="w-full px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-32 pb-20 pt-8 sm:pt-12">
        <div className="max-w-[1880px] mx-auto">
          {/* ═══ HOW IT WORKS ═══ */}
          {!showResults && (
            <ScrollReveal id="how-it-works" delay={120} className="mb-16 sm:mb-20 relative overflow-hidden">
              {/* Octopus watermark — lazy loaded, no LCP impact */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
                <img
                  src={octopusImg}
                  alt=""
                  width={900}
                  height={674}
                  loading="lazy"
                  decoding="async"
                  className="absolute right-[5%] top-[50%] -translate-y-[50%] w-[80vw] max-w-[900px] h-auto max-h-[90%] opacity-[0.10] sm:opacity-[0.14] lg:opacity-[0.18] select-none object-contain"
                />
              </div>
              <p className="relative text-[13px] sm:text-[14px] font-bold tracking-[0.18em] uppercase text-info text-center mb-4">How It Works</p>
              <h2 className="text-[36px] sm:text-[48px] lg:text-[58px] xl:text-[64px] font-extrabold text-foreground tracking-[-0.04em] text-center mb-5 leading-[1.02]">Get matched in 3 simple steps</h2>
              <p className="text-[15px] sm:text-[16px] text-foreground/65 text-center mb-12 max-w-[660px] mx-auto leading-relaxed">
                Our AI scans 940+ live EU & national funding calls and matches them to your project profile. No expertise needed.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <ScrollReveal delay={180}><HowItWorksStep step={1} title="Describe your project" description="Tell us what you want to fund: a training program, research project, or innovation idea. One sentence is enough." /></ScrollReveal>
                <ScrollReveal delay={260}><HowItWorksStep step={2} title="Get matched calls" description="Our AI instantly compares your profile against all active calls and ranks them by fit score, deadline & budget." /></ScrollReveal>
                <ScrollReveal delay={340}><HowItWorksStep step={3} title="Start your application" description="Pick your best match and turn it into an active workflow with checklists, AI drafting, and deadline tracking." /></ScrollReveal>
              </div>
            </ScrollReveal>
          )}

          {/* ═══ SCAN FORM ═══ */}
          {!showResults && (
            <ScrollReveal delay={220} id="scan-form" className="max-w-[1320px] mx-auto bg-card rounded-[16px] border-2 border-info/45 shadow-[0_14px_78px_-14px_hsl(var(--info)/0.28),0_2px_14px_-4px_hsl(var(--info)/0.12)] p-8 sm:p-12 lg:p-14 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-info/60 via-info to-info/60" />
              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-foreground tracking-[-0.03em] leading-tight mb-2">
                What do you want to fund?
              </h2>
              <p className="text-[15px] text-foreground/60 leading-relaxed mb-7 max-w-[980px]">
                Describe your project, idea, or funding need in as much detail as possible. The more you tell us about your objectives, target group, and domain, the more precise our AI matchmaking will be against active calls.
              </p>
              <form onSubmit={handleScan} className="space-y-5">
                <div>
                  <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Project Description</label>
                  <textarea value={projectIntent} onChange={e => setProjectIntent(e.target.value)} placeholder="e.g. We want to build an AI-powered training platform for healthcare professionals across 3 EU countries, targeting upskilling in digital health tools..." rows={4} className="w-full px-5 py-4 bg-background border border-border rounded-[6px] text-[15px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Organization Type</label>
                    <select aria-label="Organization Type" value={organizationType} onChange={e => setOrganizationType(e.target.value)} className="w-full px-5 py-4 bg-background border border-border rounded-[6px] text-[15px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                      <option value="">Select type</option>
                      {orgTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Primary Domain</label>
                    <select aria-label="Primary Domain" value={primaryDomain} onChange={e => setPrimaryDomain(e.target.value)} className="w-full px-5 py-4 bg-background border border-border rounded-[6px] text-[15px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                      <option value="">Select domain</option>
                      {domains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-dashed border-info/35 bg-info/[0.04] text-[11px] font-bold text-info hover:bg-info/[0.1] hover:border-info/55 transition-all active:scale-[0.97]">
                    {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {showAdvanced ? "Hide Filters" : "Advanced Filters"}
                  </button>
                </div>
                {showAdvanced && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Grant Type</label>
                      <select value={grantType} onChange={e => setGrantType(e.target.value)} className="w-full px-5 py-4 bg-background border border-border rounded-[6px] text-[15px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                        <option value="">All types</option>
                        {grantTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Funding Status</label>
                      <select value={fundingStatus} onChange={e => setFundingStatus(e.target.value)} className="w-full px-5 py-4 bg-background border border-border rounded-[6px] text-[15px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                        <option value="">All statuses</option>
                        {fundingStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Budget Range</label>
                      <select value={budgetRange} onChange={e => setBudgetRange(e.target.value)} className="w-full px-5 py-4 bg-background border border-border rounded-[6px] text-[15px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                        <option value="">Any budget</option>
                        {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase block mb-2">Geography</label>
                      <select value={geography} onChange={e => setGeography(e.target.value)} className="w-full px-5 py-4 bg-background border border-border rounded-[6px] text-[15px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all appearance-none">
                        <option value="">Any geography</option>
                        {geographies.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                <div className="flex justify-center pt-2">
                  <button type="submit" disabled={isScanning} className="ink-glow-info px-8 py-3 bg-info text-info-foreground text-[13px] font-bold rounded-full disabled:opacity-50 inline-flex items-center gap-2 shadow-lg shadow-info/25">
                    {isScanning ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Scanning…</> : <><Search className="h-3.5 w-3.5" /> Scan Opportunities</>}
                  </button>
                </div>
                <p className="text-[12px] text-foreground/50 text-center">Free · No account required · Real EU data</p>
              </form>
            </ScrollReveal>
          )}

          {/* Stat blocks */}
          {!showResults && (
            <ScrollReveal delay={300} className="max-w-[1320px] mx-auto mt-12 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                <StatBlock number="940+" label="Active calls" />
                <StatBlock number="3" label="Free matches" />
                <StatBlock number="60s" label="To results" />
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* ═══ RESULTS + PRICING + FOOTER ═══ */}
      <div className="w-full px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-32 max-w-[1880px] mx-auto">
        {showResults && (
          <div ref={resultsRef} className="space-y-8 relative z-10 mb-20">
            <div className="flex items-center justify-between opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-info mb-1">Scan Results</p>
                <h2 className="text-[26px] font-extrabold text-foreground tracking-tight">{matches.length} calls matched</h2>
                <p className="text-[13px] text-foreground/70 mt-0.5">for "{projectIntent}"</p>
              </div>
              <button onClick={() => { setShowResults(false); setMatches([]); }} className="text-[12px] font-bold text-foreground/80 hover:text-foreground transition-all px-4 py-2 rounded-full border border-border hover:border-foreground/30 hover:bg-secondary/60 active:scale-[0.96]">New Scan</button>
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
                  <h3 className="text-[24px] font-extrabold text-foreground tracking-[-0.03em] mb-3">
                    Unlock {lockedCount} more matches & full platform
                  </h3>
                  <p className="text-[14px] text-muted-foreground max-w-[460px] mx-auto mb-8 leading-relaxed">
                    See all matched opportunities, get application checklists, and access the INK Application Builder.
                  </p>
                  <div className="flex gap-3 max-w-[440px] mx-auto">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 px-4 py-3.5 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-foreground/45 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all" />
                    <button onClick={handleUnlock} className="ink-glow-info px-6 py-3 bg-info text-info-foreground text-[13px] font-bold rounded-full flex items-center gap-2 whitespace-nowrap shadow-lg shadow-info/25">
                      Unlock Platform <ArrowRight className="h-3.5 w-3.5" />
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
        <Footer variant="landing" />
      </div>
      </main>
    </div>
  );
};

/* ── How It Works step ── */
function HowItWorksStep({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="relative flex flex-col items-center text-center p-8 sm:p-9 rounded-[12px] border border-border bg-card hover:shadow-lg hover:shadow-info/[0.08] transition-all duration-300 group min-h-[240px] justify-center">
      <span className="text-[58px] sm:text-[64px] font-light leading-none mb-5 select-none text-primary" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>{step}</span>
      <h3 className="text-[18px] font-bold text-foreground leading-snug mb-2">{title}</h3>
      <p className="text-[14px] text-foreground/65 leading-relaxed max-w-[360px]">{description}</p>
    </div>
  );
}

/* ── Stat block for hero ── */
function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center px-7 sm:px-8 py-4.5 rounded-[8px] border border-foreground/15 bg-background shadow-sm min-w-[150px]">
      <p className="text-[30px] sm:text-[34px] font-extrabold text-foreground leading-none mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>{number}</p>
      <p className="text-[11px] text-foreground/60 font-semibold uppercase tracking-wider">{label}</p>
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
            <p className="text-[12px] text-foreground/75 leading-relaxed"><span className="font-semibold text-foreground">Why it fits: </span>{match.whyItFits}</p>
            <p className="text-[12px] text-foreground/75 leading-relaxed"><span className="font-semibold text-foreground">Key challenge: </span>{match.whyDifficult}</p>
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

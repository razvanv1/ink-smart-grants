import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ORG_TYPES = ["Non-Profit", "Social Enterprise", "University / HEI", "Research Institute", "SME", "Public Body", "Other"];
const FUNDING_SOURCES = ["Horizon Europe", "Erasmus+", "Digital Europe", "ESF+", "CERV", "LIFE", "National Grants", "Structural Funds"];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Organization
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [country, setCountry] = useState("");
  const [size, setSize] = useState("");

  // Step 2: Funding profile basics
  const [fundingGoals, setFundingGoals] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");

  const toggleSource = (s: string) =>
    setSelectedSources((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Create organization
      const { data: org, error: orgErr } = await supabase
        .from("organizations")
        .insert({ name: orgName, type: orgType, country, size, onboarding_complete: true })
        .select()
        .single();
      if (orgErr) throw orgErr;

      // 2. Add user as owner
      const { error: memErr } = await supabase
        .from("organization_members")
        .insert({ organization_id: org.id, user_id: user.id, role: "owner" });
      if (memErr) throw memErr;

      // 3. Create funding profile
      const { error: fpErr } = await supabase
        .from("funding_profiles")
        .insert({
          organization_id: org.id,
          funding_goals: fundingGoals || null,
          preferred_sources: selectedSources,
          budget_range: budgetRange || null,
          completeness: Math.min(100, [orgName, orgType, country, fundingGoals, budgetRange].filter(Boolean).length * 20),
        });
      if (fpErr) throw fpErr;

      toast({ title: "Workspace ready" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[460px]">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="h-7 w-7 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-[12px] font-extrabold text-primary-foreground tracking-tighter">IN</span>
          </div>
          <span className="font-extrabold text-foreground tracking-[-0.04em] text-[17px]">INK</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className={`h-0.5 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-border"}`} />
          <div className={`h-0.5 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`} />
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Set up your organization</h2>
              <p className="text-[13px] text-muted-foreground mt-1">This defines your funding workspace.</p>
            </div>

            <div className="space-y-3">
              <Input placeholder="Organization name" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="h-10 text-[13px]" />

              <div>
                <label className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5 block">Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {ORG_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setOrgType(t)}
                      className={`px-3 py-1.5 text-[12px] rounded border transition-colors ${
                        orgType === t
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="h-10 text-[13px]" />
              <Input placeholder="Team size (e.g. 5–10 staff)" value={size} onChange={(e) => setSize(e.target.value)} className="h-10 text-[13px]" />
            </div>

            <Button onClick={() => setStep(2)} className="w-full h-10 text-[13px]" disabled={!orgName}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Funding priorities</h2>
              <p className="text-[13px] text-muted-foreground mt-1">Help INK find the right opportunities. You can refine this later.</p>
            </div>

            <div className="space-y-3">
              <Textarea
                placeholder="What do you want to fund? (e.g. expand training delivery across Europe)"
                value={fundingGoals}
                onChange={(e) => setFundingGoals(e.target.value)}
                className="text-[13px] min-h-[80px]"
              />

              <div>
                <label className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5 block">Preferred programmes</label>
                <div className="flex flex-wrap gap-1.5">
                  {FUNDING_SOURCES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSource(s)}
                      className={`px-3 py-1.5 text-[12px] rounded border transition-colors ${
                        selectedSources.includes(s)
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <Input placeholder="Typical project budget range (e.g. €150K – €2M)" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className="h-10 text-[13px]" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-10 text-[13px]">
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1 h-10 text-[13px]" disabled={loading}>
                {loading ? "…" : "Launch workspace"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

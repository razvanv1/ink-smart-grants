import { useParams, Link } from "react-router-dom";
import { opportunities } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { ArrowLeft, Calendar, MapPin, Users, Zap, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const OpportunityDetail = () => {
  const { id } = useParams();
  const opp = opportunities.find(o => o.id === id);

  if (!opp) {
    return (
      <div className="p-6 max-w-[1000px] mx-auto">
        <Link to="/opportunities" className="text-sm text-primary hover:underline flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
        </Link>
        <p className="text-muted-foreground">Opportunity not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <Link to="/opportunities" className="text-sm text-primary hover:underline flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Opportunities
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusChip status={opp.status} />
            <UrgencyIndicator urgency={opp.urgency} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{opp.callName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{opp.programme} · {opp.thematicArea}</p>
        </div>
        <Link
          to={`/workflows/new?opportunity=${opp.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] shrink-0"
        >
          Start Application Workflow <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Main info */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Summary</h2>
            <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{opp.summary}</p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Deadline" value={opp.deadline} />
              <InfoRow icon={<Zap className="h-4 w-4" />} label="Funding Range" value={opp.fundingRange} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Geography" value={opp.geography} />
              <InfoRow icon={<Users className="h-4 w-4" />} label="Partner Required" value={opp.partnerRequired ? 'Yes' : 'No'} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-success" /> Why It Fits
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{opp.whyItFits}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-warning" /> Why It May Be Difficult
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{opp.whyDifficult}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Eligibility</h3>
            <p className="text-sm text-muted-foreground">{opp.eligibility}</p>
          </div>
        </div>

        {/* Score sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Scores</h3>
            <ScoreRow label="Fit Score" score={opp.fitScore} />
            <ScoreRow label="Effort Score" score={opp.effortScore} />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Urgency</span>
              <UrgencyIndicator urgency={opp.urgency} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Complexity</span>
              <span className="text-sm font-medium text-foreground capitalize">{opp.complexity}</span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Recommended Action</h3>
            <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-semibold">
              {opp.recommendedAction}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Funding Type</h3>
            <p className="text-sm text-muted-foreground">{opp.fundingType}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ScoreRow({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-destructive';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-foreground">{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default OpportunityDetail;

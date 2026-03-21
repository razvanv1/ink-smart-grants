import { useParams, Link } from "react-router-dom";
import { opportunities } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { UrgencyIndicator } from "@/components/shared/ScoreBadge";
import { ArrowLeft, ArrowRight } from "lucide-react";

const OpportunityDetail = () => {
  const { id } = useParams();
  const opp = opportunities.find(o => o.id === id);

  if (!opp) {
    return (
      <div className="p-8 max-w-[900px] mx-auto">
        <Link to="/opportunities" className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
        <p className="text-muted-foreground">Not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[960px] mx-auto space-y-8">
      <Link to="/opportunities" className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Opportunities
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{opp.callName}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">{opp.programme} · {opp.thematicArea}</p>
          <div className="flex items-center gap-4 mt-3">
            <StatusChip status={opp.status} />
            <UrgencyIndicator urgency={opp.urgency} />
          </div>
        </div>
        <Link
          to={`/workflows/new?opportunity=${opp.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-foreground text-background text-[13px] font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] shrink-0"
        >
          Start Workflow <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <p className="text-[14px] text-muted-foreground leading-[1.7] text-pretty">{opp.summary}</p>

          {/* Key details — flat, no card */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-8 border-t border-border pt-6">
            <Detail label="Deadline" value={opp.deadline} />
            <Detail label="Funding" value={opp.fundingRange} />
            <Detail label="Geography" value={opp.geography} />
            <Detail label="Partner Required" value={opp.partnerRequired ? 'Yes' : 'No'} />
            <Detail label="Complexity" value={opp.complexity} />
            <Detail label="Type" value={opp.fundingType} />
          </div>

          {/* Fit / Difficulty */}
          <div className="grid md:grid-cols-2 gap-8 border-t border-border pt-6">
            <div>
              <h3 className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Why It Fits</h3>
              <p className="text-[13px] text-foreground leading-relaxed">{opp.whyItFits}</p>
            </div>
            <div>
              <h3 className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Constraints</h3>
              <p className="text-[13px] text-foreground leading-relaxed">{opp.whyDifficult}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Eligibility</h3>
            <p className="text-[13px] text-foreground">{opp.eligibility}</p>
          </div>
        </div>

        {/* Right — scores */}
        <div className="space-y-6">
          <ScoreBlock label="Fit Score" score={opp.fitScore} />
          <ScoreBlock label="Effort Score" score={opp.effortScore} />
          <div className="border-t border-border pt-4">
            <h3 className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Recommended</h3>
            <span className="text-[13px] font-semibold text-primary">{opp.recommendedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-[13px] font-medium text-foreground mt-0.5 capitalize">{value}</p>
    </div>
  );
}

function ScoreBlock({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-destructive';
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className="text-xl font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{score}</span>
      </div>
      <div className="h-1 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default OpportunityDetail;

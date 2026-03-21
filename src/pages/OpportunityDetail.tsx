import { useParams, Link } from "react-router-dom";
import { opportunities, workflows } from "@/data/sampleData";
import { StatusChip } from "@/components/shared/StatusChip";
import { ScoreBadge, UrgencyIndicator, ReadinessBar } from "@/components/shared/ScoreBadge";
import { AgentActionPanel } from "@/components/shared/AgentAction";
import { ArrowLeft, ArrowRight } from "lucide-react";

const OpportunityDetail = () => {
  const { id } = useParams();
  const opp = opportunities.find(o => o.id === id);
  const linkedWorkflow = opp ? workflows.find(w => w.opportunityId === opp.id) : null;

  if (!opp) {
    return (
      <div className="p-8 max-w-[900px] mx-auto">
        <Link to="/opportunities" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 mb-8">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
        <p className="text-muted-foreground">Opportunity not found.</p>
      </div>
    );
  }

  const needsPartner = opp.partnerRequired;
  const isHighFit = opp.fitScore >= 80;
  const isUrgent = opp.urgency === 'high' || opp.urgency === 'critical';

  return (
    <div className="p-8 max-w-[960px] mx-auto space-y-10">
      <Link to="/opportunities" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Opportunities
      </Link>

      <div className="border-b border-border pb-8">
        <div className="flex items-center gap-3 mb-3">
          <StatusChip status={opp.status} dot />
          <UrgencyIndicator urgency={opp.urgency} />
        </div>
        <h1 className="ink-page-title mb-2">{opp.callName}</h1>
        <p className="text-[13px] text-muted-foreground">{opp.programme} · {opp.thematicArea}</p>
      </div>

      <div className="grid grid-cols-3 gap-8 border-b border-border pb-8">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Fit Score</p>
          <ScoreBadge score={opp.fitScore} large />
          <div className="mt-2"><ReadinessBar score={opp.fitScore} segments={12} /></div>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Effort Score</p>
          <ScoreBadge score={opp.effortScore} large />
          <div className="mt-2"><ReadinessBar score={opp.effortScore} segments={12} /></div>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Urgency</p>
          <div className="flex items-center gap-3 mt-2">
            <UrgencyIndicator urgency={opp.urgency} />
            <span className="text-[13px] font-semibold text-foreground capitalize">{opp.urgency}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Deadline {opp.deadline}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3 space-y-8">
          <p className="text-[14px] text-foreground/75 leading-[1.75] text-pretty">{opp.summary}</p>

          <div className="grid grid-cols-2 gap-y-5 gap-x-8">
            <Detail label="Funding" value={opp.fundingRange} />
            <Detail label="Geography" value={opp.geography} />
            <Detail label="Partner" value={opp.partnerRequired ? 'Required' : 'Not required'} />
            <Detail label="Complexity" value={opp.complexity} />
            <Detail label="Type" value={opp.fundingType} />
            <Detail label="Eligibility" value={opp.eligibility} />
          </div>

          <AgentActionPanel
            context={`${isHighFit ? 'Strong thematic fit' : 'Moderate fit'} · ${opp.complexity} complexity${needsPartner ? ' · Consortium required' : ''}${isUrgent ? ' · Deadline approaching' : ''}`}
            actions={[
              ...(needsPartner ? [{ label: 'Find matching partners', variant: 'coordination' as const, primary: true }] : []),
              ...(isHighFit && !linkedWorkflow ? [{ label: 'Turn this into a workflow', variant: 'strategic' as const, primary: true }] : []),
              { label: 'Generate decision brief', variant: 'drafting' as const, primary: !needsPartner && !!linkedWorkflow },
              { label: 'Estimate execution effort', variant: 'strategic' as const },
              { label: 'Compare similar calls', variant: 'knowledge' as const },
            ]}
          />
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="ink-accent-border">
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Why It Fits</p>
            <p className="text-[13px] text-foreground leading-relaxed">{opp.whyItFits}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase mb-2">Constraints</p>
            <p className="text-[13px] text-foreground leading-relaxed">{opp.whyDifficult}</p>
          </div>
          <div className="border-t border-border pt-5">
            <p className="text-[10px] text-primary tracking-[0.12em] uppercase font-semibold mb-2">Recommended</p>
            {linkedWorkflow ? (
              <Link
                to={`/workflows/${linkedWorkflow.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-[12px] font-bold tracking-wide rounded-sm hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                VIEW WORKFLOW <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : opp.status === 'ignored' || opp.status === 'rejected' ? (
              <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-foreground text-[12px] font-bold tracking-wide rounded-sm hover:bg-secondary transition-colors active:scale-[0.97]">
                MOVE TO WATCHLIST
              </button>
            ) : (
              <Link
                to={`/workflows/new?opportunity=${opp.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-[12px] font-bold tracking-wide rounded-sm hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                START WORKFLOW <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase">{label}</p>
      <p className="text-[13px] font-medium text-foreground mt-0.5 capitalize">{value}</p>
    </div>
  );
}

export default OpportunityDetail;

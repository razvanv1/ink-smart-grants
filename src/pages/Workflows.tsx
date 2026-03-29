import { Link } from "react-router-dom";
import { useOpportunities } from "@/hooks/useOpportunities";
import { Loader2, FileText, ArrowRight, Calendar } from "lucide-react";

const Workflows = () => {
  const { data: opportunities, isLoading } = useOpportunities();

  // Show opportunities that are in preparation stages
  const draftableOpps = opportunities?.filter(
    (o) => o.lifecycle && [
      "assessed", "shortlisted", "in_preparation", "drafting",
      "under_review", "ready_to_submit", "saved", "docs_ready",
    ].includes(o.lifecycle)
  ) || [];

  const allOpps = opportunities || [];

  return (
    <div className="p-6 sm:p-8 max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">
            Proposal Drafting
          </p>
          <h1 className="ink-page-title">Workflows</h1>
        </div>
      </div>

      {isLoading && (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && allOpps.length === 0 && (
        <div className="py-16 text-center">
          <FileText className="h-7 w-7 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-[14px] text-muted-foreground">No opportunities yet</p>
          <p className="text-[12px] text-muted-foreground/70 mt-1">
            Save some opportunities first, then come back to generate proposal drafts.
          </p>
        </div>
      )}

      {!isLoading && draftableOpps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Ready for Drafting ({draftableOpps.length})
          </h2>
          <div className="grid gap-2">
            {draftableOpps.map((opp) => (
              <Link
                key={opp.id}
                to={`/workflows/${opp.id}`}
                className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-foreground/15 hover:shadow-sm transition-all group"
              >
                <div className="h-9 w-9 rounded-md bg-info/10 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-info" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-foreground truncate">{opp.call_name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                    <span>{opp.programme}</span>
                    {opp.lifecycle && (
                      <span className="px-1.5 py-0.5 bg-muted rounded text-[9px] uppercase font-bold tracking-wider">
                        {opp.lifecycle.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>
                </div>
                {opp.deadline && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                    <Calendar className="h-3 w-3" />
                    {new Date(opp.deadline).toLocaleDateString()}
                  </div>
                )}
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Show remaining opportunities too */}
      {!isLoading && allOpps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            All Opportunities ({allOpps.length})
          </h2>
          <div className="grid gap-2">
            {allOpps
              .filter((o) => !draftableOpps.some((d) => d.id === o.id))
              .map((opp) => (
                <Link
                  key={opp.id}
                  to={`/workflows/${opp.id}`}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-foreground/15 transition-all group opacity-70 hover:opacity-100"
                >
                  <div className="h-9 w-9 rounded-md bg-muted/60 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-foreground truncate">{opp.call_name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                      <span>{opp.programme}</span>
                      {opp.lifecycle && (
                        <span className="px-1.5 py-0.5 bg-muted rounded text-[9px] uppercase font-bold tracking-wider">
                          {opp.lifecycle.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflows;

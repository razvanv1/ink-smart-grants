import { fundingProfile, currentOrganization } from "@/data/sampleData";
import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { AgentActionPanel } from "@/components/shared/AgentAction";
import { useState } from "react";

const missingFields = ['Staff competency matrix', 'Organizational chart', 'Financial sustainability statement'];

const FundingProfile = () => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="p-8 max-w-[860px] mx-auto space-y-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Organization Identity</p>
          <h1 className="ink-page-title">Funding Profile</h1>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="px-3 py-1.5 bg-foreground text-background text-[11px] font-bold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity active:scale-[0.97]"
        >
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="border-b border-border pb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-semibold">Profile Completeness</span>
          <ReadinessBar score={fundingProfile.completeness} segments={12} />
        </div>
        <div className="space-y-1 mt-3">
          {missingFields.map((m, i) => (
            <p key={i} className="text-[11px] text-muted-foreground">Missing: {m}</p>
          ))}
        </div>
      </div>

      <AgentActionPanel
        label="Profile intelligence"
        actions={[
          { label: 'Improve profile quality', variant: 'strategic' },
          { label: 'Detect eligibility gaps', variant: 'compliance' },
          { label: 'Suggest better targeting', variant: 'strategic' },
          { label: 'Expand funding sources', variant: 'knowledge' },
          { label: 'Highlight weaknesses', variant: 'compliance' },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
        <Field label="Organization" value={currentOrganization.name} />
        <Field label="Type" value={currentOrganization.type} />
        <Field label="Country" value={currentOrganization.country} />
        <Field label="Budget Range" value={fundingProfile.budgetRange} />
        <Field label="Team Capacity" value={fundingProfile.internalCapacity} />
        <Field label="Prior Experience" value={fundingProfile.priorExperience} />
      </div>

      <div className="ink-rule" />

      <Field label="Funding Goals" value={fundingProfile.fundingGoals} />
      <Field label="Partnership Readiness" value={fundingProfile.partnershipReadiness} />

      <div className="ink-rule" />

      <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
        <Tags label="Primary Domains" tags={currentOrganization.domainFocus} />
        <Tags label="Geography Preferences" tags={fundingProfile.geographyPreferences} />
        <Tags label="Preferred Sources" tags={fundingProfile.preferredSources} />
        <Tags label="Preferred Types" tags={fundingProfile.preferredTypes} />
      </div>

      <div className="ink-rule" />

      <Tags label="Excluded Themes" tags={fundingProfile.excludedThemes} muted />

      <div className="ink-rule" />

      <div>
        <Field label="Notes" value={fundingProfile.notes} />
        <p className="text-[10px] text-muted-foreground mt-3">Updated {fundingProfile.updatedAt}</p>
      </div>
    </div>
  );
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-medium">{label}</p>
      <p className="text-[13px] text-foreground mt-1 leading-relaxed">{value}</p>
    </div>
  );
}

function Tags({ label, tags, muted }: { label: string; tags: string[]; muted?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-medium mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className={`px-2 py-0.5 rounded-sm text-[11px] font-semibold ${
            muted ? 'bg-secondary text-muted-foreground line-through' : 'bg-secondary text-foreground'
          }`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default FundingProfile;

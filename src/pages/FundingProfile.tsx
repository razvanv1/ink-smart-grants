const profileData = {
  orgName: 'The Unlearning School',
  orgType: 'Non-Profit / Social Enterprise',
  country: 'Greece',
  primaryDomains: ['Digital Skills', 'Workforce Development', 'Education Innovation'],
  secondaryDomains: ['Green Transition', 'Civic Engagement'],
  fundingGoals: 'Expand training delivery across Southern and Eastern Europe. Build AI literacy programming. Strengthen consortium leadership capacity.',
  budgetRange: '€150K – €4M',
  teamCapacity: '3–4 concurrent workflows',
  priorExperience: '6 successful applications (Erasmus+ KA2, ESF+, national innovation grants)',
  partnershipReadiness: 'Active network of 14 partners across 8 EU countries',
  preferredSources: ['Horizon Europe', 'Erasmus+', 'Digital Europe', 'ESF+'],
  preferredTypes: ['RIA', 'Cooperation Partnership', 'CSA', 'National Grant'],
  excludedThemes: ['Military/defense', 'Nuclear energy', 'Fossil fuel extraction'],
  notes: 'Prioritizing digital skills and AI literacy calls. Seeking coordination roles.',
  completeness: 85,
  lastUpdated: '2026-03-15',
};

const missing = ['Staff competency matrix', 'Organizational chart', 'Financial sustainability statement'];

import { ReadinessBar } from "@/components/shared/ScoreBadge";

const FundingProfile = () => {
  return (
    <div className="p-8 max-w-[860px] mx-auto space-y-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Organization Identity</p>
          <h1 className="ink-page-title">Funding Profile</h1>
        </div>
        <button className="px-3 py-1.5 bg-foreground text-background text-[11px] font-bold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity active:scale-[0.97]">
          Edit
        </button>
      </div>

      {/* Completeness with INK readiness segments */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-semibold">Profile Completeness</span>
          <ReadinessBar score={profileData.completeness} segments={12} />
        </div>
        <div className="space-y-1 mt-3">
          {missing.map((m, i) => (
            <p key={i} className="text-[11px] text-muted-foreground">Missing: {m}</p>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
        <Field label="Organization" value={profileData.orgName} />
        <Field label="Type" value={profileData.orgType} />
        <Field label="Country" value={profileData.country} />
        <Field label="Budget Range" value={profileData.budgetRange} />
        <Field label="Team Capacity" value={profileData.teamCapacity} />
        <Field label="Prior Experience" value={profileData.priorExperience} />
      </div>

      <div className="ink-rule" />

      <Field label="Funding Goals" value={profileData.fundingGoals} />
      <Field label="Partnership Readiness" value={profileData.partnershipReadiness} />

      <div className="ink-rule" />

      <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
        <Tags label="Primary Domains" tags={profileData.primaryDomains} />
        <Tags label="Secondary Domains" tags={profileData.secondaryDomains} />
        <Tags label="Preferred Sources" tags={profileData.preferredSources} />
        <Tags label="Preferred Types" tags={profileData.preferredTypes} />
      </div>

      <div className="ink-rule" />

      <Tags label="Excluded" tags={profileData.excludedThemes} muted />

      <div className="ink-rule" />

      <div>
        <Field label="Notes" value={profileData.notes} />
        <p className="text-[10px] text-muted-foreground mt-3">Updated {profileData.lastUpdated}</p>
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

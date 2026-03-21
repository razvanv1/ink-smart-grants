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
  notes: 'Prioritizing calls with digital skills and AI literacy focus. Seeking coordination role opportunities.',
  completeness: 85,
  lastUpdated: '2026-03-15',
};

const missing = [
  'Staff competency matrix',
  'Updated organizational chart',
  'Financial sustainability statement',
];

const FundingProfile = () => {
  return (
    <div className="p-8 max-w-[860px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Funding Profile</h1>
        <button className="px-3 py-1.5 rounded bg-foreground text-background text-[13px] font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]">
          Edit
        </button>
      </div>

      {/* Completeness */}
      <div className="border-b border-border pb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Profile Completeness</span>
          <span className="text-sm font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{profileData.completeness}%</span>
        </div>
        <div className="h-1 rounded-full bg-secondary overflow-hidden mb-3">
          <div className="h-full rounded-full bg-foreground" style={{ width: `${profileData.completeness}%` }} />
        </div>
        <div className="space-y-1">
          {missing.map((m, i) => (
            <p key={i} className="text-[12px] text-muted-foreground">· {m}</p>
          ))}
        </div>
      </div>

      {/* Fields — flat, no card wrappers */}
      <div className="grid md:grid-cols-2 gap-y-5 gap-x-10">
        <Field label="Organization" value={profileData.orgName} />
        <Field label="Type" value={profileData.orgType} />
        <Field label="Country" value={profileData.country} />
        <Field label="Budget Range" value={profileData.budgetRange} />
        <Field label="Team Capacity" value={profileData.teamCapacity} />
        <Field label="Prior Experience" value={profileData.priorExperience} />
      </div>

      <div className="border-t border-border pt-6 space-y-5">
        <Field label="Funding Goals" value={profileData.fundingGoals} />
        <Field label="Partnership Readiness" value={profileData.partnershipReadiness} />
      </div>

      <div className="border-t border-border pt-6 grid md:grid-cols-2 gap-y-5 gap-x-10">
        <Tags label="Primary Domains" tags={profileData.primaryDomains} />
        <Tags label="Secondary Domains" tags={profileData.secondaryDomains} />
        <Tags label="Preferred Sources" tags={profileData.preferredSources} />
        <Tags label="Preferred Types" tags={profileData.preferredTypes} />
      </div>

      <div className="border-t border-border pt-6">
        <Tags label="Excluded" tags={profileData.excludedThemes} muted />
      </div>

      <div className="border-t border-border pt-6">
        <Field label="Notes" value={profileData.notes} />
        <p className="text-[11px] text-muted-foreground mt-4">Last updated {profileData.lastUpdated}</p>
      </div>
    </div>
  );
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-[13px] text-foreground mt-0.5 leading-relaxed">{value}</p>
    </div>
  );
}

function Tags({ label, tags, muted }: { label: string; tags: string[]; muted?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className={`px-2 py-0.5 rounded text-[12px] font-medium ${
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

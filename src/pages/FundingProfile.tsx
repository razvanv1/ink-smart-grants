import { CheckCircle2, AlertCircle } from "lucide-react";

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
  notes: 'Currently prioritizing calls with digital skills and AI literacy focus. Actively seeking coordination role opportunities.',
  completeness: 85,
  lastUpdated: '2026-03-15',
};

const missingFields = [
  'Add detailed staff competency matrix',
  'Upload updated organizational chart',
  'Complete financial sustainability statement',
];

const FundingProfile = () => {
  return (
    <div className="p-6 max-w-[1000px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Funding Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your organization's funding identity and eligibility</p>
        </div>
        <button className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]">
          Edit Profile
        </button>
      </div>

      {/* Completeness */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Profile Completeness</h3>
          <span className="text-sm font-semibold tabular-nums text-foreground">{profileData.completeness}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
          <div className="h-full rounded-full bg-primary" style={{ width: `${profileData.completeness}%` }} />
        </div>
        {missingFields.length > 0 && (
          <div className="space-y-1.5">
            {missingFields.map((field, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />
                {field}
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-muted-foreground mt-3">Last updated: {profileData.lastUpdated}</p>
      </div>

      {/* Profile Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <ProfileCard label="Organization Name" value={profileData.orgName} />
        <ProfileCard label="Organization Type" value={profileData.orgType} />
        <ProfileCard label="Country / Geography" value={profileData.country} />
        <ProfileCard label="Budget Range" value={profileData.budgetRange} />
        <ProfileCard label="Team Capacity" value={profileData.teamCapacity} />
        <ProfileCard label="Prior Grant Experience" value={profileData.priorExperience} />
      </div>

      <ProfileCard label="Funding Goals" value={profileData.fundingGoals} />
      <ProfileCard label="Partnership Readiness" value={profileData.partnershipReadiness} />

      <div className="grid md:grid-cols-2 gap-4">
        <TagsCard label="Primary Domains" tags={profileData.primaryDomains} />
        <TagsCard label="Secondary Domains" tags={profileData.secondaryDomains} />
        <TagsCard label="Preferred Sources" tags={profileData.preferredSources} />
        <TagsCard label="Preferred Types" tags={profileData.preferredTypes} />
      </div>

      <TagsCard label="Excluded Themes" tags={profileData.excludedThemes} variant="destructive" />

      <ProfileCard label="Notes" value={profileData.notes} />
    </div>
  );
};

function ProfileCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  );
}

function TagsCard({ label, tags, variant }: { label: string; tags: string[]; variant?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className={`px-2 py-1 rounded-md text-xs font-medium ${
            variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground'
          }`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default FundingProfile;

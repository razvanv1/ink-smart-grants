import { ReadinessBar } from "@/components/shared/ScoreBadge";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Construction } from "lucide-react";

const FundingProfile = () => {
  const orgId = useOrganizationId();

  const { data: org, isLoading: orgLoading } = useQuery({
    queryKey: ['org-detail', orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const { data, error } = await supabase.from('organizations').select('*').eq('id', orgId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['funding-profile', orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const { data, error } = await supabase.from('funding_profiles').select('*').eq('organization_id', orgId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });

  if (orgLoading || profileLoading) {
    return (
      <div className="p-8 max-w-[860px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[860px] mx-auto space-y-10">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Organization Identity</p>
          <h1 className="ink-page-title">Funding Profile</h1>
        </div>
      </div>

      {/* Real org data */}
      {org && (
        <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
          <Field label="Organization" value={org.name} />
          <Field label="Type" value={org.type || '—'} />
          <Field label="Country" value={org.country || '—'} />
          <Field label="Size" value={org.size || '—'} />
          {org.domain_focus && org.domain_focus.length > 0 && (
            <div className="md:col-span-2">
              <Tags label="Domain Focus" tags={org.domain_focus} />
            </div>
          )}
        </div>
      )}

      {/* Real profile data if exists */}
      {profile && (
        <>
          <div className="ink-rule" />
          <div className="border-b border-border pb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-semibold">Profile Completeness</span>
              <ReadinessBar score={profile.completeness || 0} segments={12} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
            {profile.budget_range && <Field label="Budget Range" value={profile.budget_range} />}
            {profile.internal_capacity && <Field label="Team Capacity" value={profile.internal_capacity} />}
            {profile.prior_experience && <Field label="Prior Experience" value={profile.prior_experience} />}
            {profile.partnership_readiness && <Field label="Partnership Readiness" value={profile.partnership_readiness} />}
          </div>

          {profile.funding_goals && (
            <>
              <div className="ink-rule" />
              <Field label="Funding Goals" value={profile.funding_goals} />
            </>
          )}

          <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
            {profile.preferred_sources && profile.preferred_sources.length > 0 && <Tags label="Preferred Sources" tags={profile.preferred_sources} />}
            {profile.preferred_types && profile.preferred_types.length > 0 && <Tags label="Preferred Types" tags={profile.preferred_types} />}
            {profile.geography_preferences && profile.geography_preferences.length > 0 && <Tags label="Geography" tags={profile.geography_preferences} />}
          </div>

          {profile.excluded_themes && profile.excluded_themes.length > 0 && (
            <>
              <div className="ink-rule" />
              <Tags label="Excluded Themes" tags={profile.excluded_themes} muted />
            </>
          )}

          {profile.notes && (
            <>
              <div className="ink-rule" />
              <Field label="Notes" value={profile.notes} />
            </>
          )}
        </>
      )}

      {/* If no profile exists */}
      {!profile && org && (
        <>
          <div className="ink-rule" />
          <div className="py-16 text-center space-y-4">
            <Construction className="h-8 w-8 text-muted-foreground/30 mx-auto" />
            <div>
              <p className="text-[14px] text-foreground font-semibold">Funding profile not yet configured</p>
              <p className="text-[12px] text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                Complete your funding profile to improve opportunity matching accuracy. 
                This can be configured in Settings or during onboarding.
              </p>
            </div>
          </div>
        </>
      )}
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

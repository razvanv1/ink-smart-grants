import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Returns the current user's organization_id.
 * Fetched once from organization_members and cached.
 */
export function useOrganizationId(): string | null {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ['user-org', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data?.organization_id ?? null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  return data ?? null;
}

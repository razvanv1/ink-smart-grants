import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RunAssessmentResponse {
  status: string;
  opportunityId: string;
  basedOnDocs: boolean;
  judgment?: string;
  error?: string;
}

export function useRunAssessment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ opportunityId }: { opportunityId: string }): Promise<RunAssessmentResponse> => {
      const { data, error } = await supabase.functions.invoke('run-assessment', {
        body: { opportunityId },
      });

      if (error) {
        // Try to extract meaningful error from edge function response
        const err = error as { context?: Response; message?: string };
        if (err?.context) {
          try {
            const payload = await err.context.json();
            if (payload?.error) throw new Error(payload.error);
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== err?.message) throw parseErr;
          }
        }
        throw new Error(err?.message || 'Failed to run assessment');
      }

      return data as RunAssessmentResponse;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['opportunity', variables.opportunityId] });
      qc.invalidateQueries({ queryKey: ['opportunities'] });
      qc.invalidateQueries({ queryKey: ['saved-calls'] });
    },
    onError: (_err, variables) => {
      // Refetch to get the error state from DB
      qc.invalidateQueries({ queryKey: ['opportunity', variables.opportunityId] });
      qc.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

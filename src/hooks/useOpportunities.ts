import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganizationId } from "./useOrganizationId";

// ── Types matching DB schema ─────────────────────────────────────

export type CallLifecycle =
  | 'discovered' | 'saved' | 'docs_pending' | 'docs_ready'
  | 'assessment_pending' | 'assessed' | 'shortlisted' | 'rejected'
  | 'in_preparation' | 'awaiting_documents' | 'drafting'
  | 'under_review' | 'ready_to_submit' | 'submitted' | 'archived';

export type EligibilityStatus = 'eligible' | 'not_eligible' | 'uncertain' | 'needs_manual_review';
export type Priority = 'high' | 'medium' | 'low';
export type Judgment = 'go' | 'watch' | 'no_go';
export type DocsStatus = 'not_downloaded' | 'downloading' | 'docs_pending' | 'docs_ready';
export type Urgency = 'low' | 'medium' | 'high' | 'critical';
export type ActionItemStatus = 'pending' | 'done' | 'blocked';

export interface OpportunityRow {
  id: string;
  organization_id: string;
  call_name: string;
  programme: string;
  source_url: string;
  geography: string;
  thematic_area: string;
  funding_type: string;
  funding_range: string;
  deadline: string | null;
  eligibility_text: string;
  complexity: string;
  partner_required: boolean;
  summary: string;
  why_it_fits: string;
  why_difficult: string;
  fit_score: number;
  effort_score: number;
  urgency: Urgency;
  lifecycle: CallLifecycle;
  docs_status: DocsStatus;
  priority: Priority;
  blockers: string[];
  recommended_action: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentRow {
  id: string;
  opportunity_id: string;
  eligibility: EligibilityStatus;
  eligibility_notes: string;
  fit_score: number;
  fit_notes: string;
  effort_score: number;
  complexity_notes: string;
  risks: string[];
  recommendation: string;
  judgment: Judgment;
  based_on_docs: boolean;
  assessed_at: string;
}

export interface DocumentRow {
  id: string;
  opportunity_id: string;
  name: string;
  doc_type: string;
  url: string | null;
  downloaded_at: string | null;
  parsed: boolean;
  pages: number | null;
}

export interface ActionItemRow {
  id: string;
  opportunity_id: string;
  action: string;
  owner: string | null;
  due_date: string | null;
  status: ActionItemStatus;
}

export interface NoteRow {
  id: string;
  opportunity_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface DownloadDocumentsResponse {
  success: boolean;
  message: string;
  created_documents: number;
  total_documents: number;
  opportunity_id: string;
}

// Full opportunity with relations
export interface OpportunityFull extends OpportunityRow {
  assessment: AssessmentRow | null;
  documents: DocumentRow[];
  action_items: ActionItemRow[];
  notes: NoteRow[];
}

// ── Helper: lifecycle label ──────────────────────────────────────

const lifecycleLabels: Record<CallLifecycle, string> = {
  discovered: 'Discovered', saved: 'Saved', docs_pending: 'Docs Pending',
  docs_ready: 'Docs Ready', assessment_pending: 'Assessment Pending',
  assessed: 'Assessed', shortlisted: 'Shortlisted', rejected: 'Rejected',
  in_preparation: 'In Preparation', awaiting_documents: 'Awaiting Documents',
  drafting: 'Drafting', under_review: 'Under Review',
  ready_to_submit: 'Ready to Submit', submitted: 'Submitted', archived: 'Archived',
};

export function getLifecycleLabel(lifecycle: string): string {
  return lifecycleLabels[lifecycle as CallLifecycle] || lifecycle;
}

async function extractFunctionError(error: unknown, fallback: string): Promise<string> {
  const err = error as { context?: Response; message?: string };

  if (err?.context) {
    try {
      const payload = await err.context.json();
      if (payload?.error && typeof payload.error === 'string') {
        return payload.error;
      }
    } catch {
      // ignore parse failure
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof err?.message === 'string' && err.message.length > 0) {
    return err.message;
  }

  return fallback;
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useOpportunities() {
  const orgId = useOrganizationId();

  return useQuery({
    queryKey: ['opportunities', orgId],
    queryFn: async (): Promise<OpportunityRow[]> => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('organization_id', orgId)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as OpportunityRow[];
    },
    enabled: !!orgId,
    refetchInterval: 10000,
  });
}

export function useOpportunityDetail(id: string | undefined) {
  const orgId = useOrganizationId();

  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: async (): Promise<OpportunityFull | null> => {
      if (!id) return null;
      const [oppRes, assessRes, docsRes, actionsRes, notesRes] = await Promise.all([
        supabase.from('opportunities').select('*').eq('id', id).single(),
        supabase.from('call_assessments').select('*').eq('opportunity_id', id).maybeSingle(),
        supabase.from('call_documents').select('*').eq('opportunity_id', id),
        supabase.from('call_action_items').select('*').eq('opportunity_id', id).order('created_at'),
        supabase.from('call_notes').select('*').eq('opportunity_id', id).order('created_at', { ascending: false }),
      ]);
      if (oppRes.error) throw oppRes.error;
      if (!oppRes.data) return null;

      return {
        ...(oppRes.data as unknown as OpportunityRow),
        assessment: (assessRes.data as unknown as AssessmentRow) ?? null,
        documents: (docsRes.data ?? []) as unknown as DocumentRow[],
        action_items: (actionsRes.data ?? []) as unknown as ActionItemRow[],
        notes: (notesRes.data ?? []) as unknown as NoteRow[],
      };
    },
    enabled: !!id && !!orgId,
  });
}

export function useSavedCalls() {
  const orgId = useOrganizationId();

  return useQuery({
    queryKey: ['saved-calls', orgId],
    queryFn: async (): Promise<OpportunityFull[]> => {
      if (!orgId) return [];
      const { data: opps, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('organization_id', orgId)
        .not('lifecycle', 'in', '("discovered","rejected","archived")')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      if (!opps || opps.length === 0) return [];

      const ids = opps.map(o => o.id);
      const [assessRes, actionsRes] = await Promise.all([
        supabase.from('call_assessments').select('*').in('opportunity_id', ids),
        supabase.from('call_action_items').select('*').in('opportunity_id', ids),
      ]);

      const assessMap = new Map((assessRes.data ?? []).map(a => [a.opportunity_id, a]));
      const actionsMap = new Map<string, any[]>();
      for (const a of actionsRes.data ?? []) {
        if (!actionsMap.has(a.opportunity_id)) actionsMap.set(a.opportunity_id, []);
        actionsMap.get(a.opportunity_id)!.push(a);
      }

      return opps.map(o => ({
        ...(o as unknown as OpportunityRow),
        assessment: (assessMap.get(o.id) as unknown as AssessmentRow) ?? null,
        documents: [],
        action_items: (actionsMap.get(o.id) ?? []) as unknown as ActionItemRow[],
        notes: [],
      }));
    },
    enabled: !!orgId,
    refetchInterval: 10000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────

export function useUpdateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from('opportunities').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['opportunities'] });
      qc.invalidateQueries({ queryKey: ['saved-calls'] });
      qc.invalidateQueries({ queryKey: ['opportunity'] });
    },
  });
}

export function useAddNote() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ opportunityId, content }: { opportunityId: string; content: string }) => {
      const { error } = await supabase.from('call_notes').insert({
        opportunity_id: opportunityId,
        user_id: user!.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['opportunity'] });
    },
  });
}

export function useUpdateActionItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ActionItemStatus }) => {
      const { error } = await supabase.from('call_action_items').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['opportunity'] });
      qc.invalidateQueries({ queryKey: ['saved-calls'] });
    },
  });
}

export function useDownloadDocuments() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ opportunityId }: { opportunityId: string }): Promise<DownloadDocumentsResponse> => {
      const { data, error } = await supabase.functions.invoke('download-call-documents', {
        body: { opportunityId },
      });

      if (error) {
        const message = await extractFunctionError(error, 'Failed to start document ingestion');
        throw new Error(message);
      }

      return (data ?? {
        success: true,
        message: 'Document ingestion started',
        created_documents: 0,
        total_documents: 0,
        opportunity_id: opportunityId,
      }) as DownloadDocumentsResponse;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['opportunities'] });
      qc.invalidateQueries({ queryKey: ['saved-calls'] });
      qc.invalidateQueries({ queryKey: ['opportunity'] });
      qc.invalidateQueries({ queryKey: ['opportunity', variables.opportunityId] });
    },
  });
}

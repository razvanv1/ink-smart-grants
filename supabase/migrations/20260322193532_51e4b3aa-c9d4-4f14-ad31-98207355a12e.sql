ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS assessment_run_status text DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS assessment_run_error text DEFAULT NULL;
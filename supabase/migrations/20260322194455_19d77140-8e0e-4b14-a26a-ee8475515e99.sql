-- Create storage bucket for call documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('call-documents', 'call-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: authenticated users can read files in their org's folder
CREATE POLICY "Org members can read call documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'call-documents'
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
  )
);

-- RLS: service role inserts are unrestricted (edge function uses service role)
-- No insert policy needed for authenticated users since edge function handles uploads

-- Add storage_path column to call_documents
ALTER TABLE public.call_documents
  ADD COLUMN IF NOT EXISTS storage_path text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS file_size bigint DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS content_type text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS download_error text DEFAULT NULL;
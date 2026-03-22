CREATE POLICY "Org members can upload call documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'call-documents'
  AND EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Org members can update call documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'call-documents'
  AND EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
  )
);
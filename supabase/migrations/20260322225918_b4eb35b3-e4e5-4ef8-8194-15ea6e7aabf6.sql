CREATE POLICY "Admins can delete funding profiles"
ON public.funding_profiles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = funding_profiles.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
  )
);
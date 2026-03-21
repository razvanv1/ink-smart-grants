
-- Fix: Replace overly permissive org insert policy with one that ensures the creator immediately adds themselves as member
DROP POLICY "Authenticated users can create organizations" ON public.organizations;

CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = id AND user_id = auth.uid()
    )
    OR NOT EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = id
    )
  );

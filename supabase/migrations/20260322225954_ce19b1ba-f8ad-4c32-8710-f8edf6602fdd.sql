DROP POLICY "Admins can update member roles" ON public.organization_members;

CREATE POLICY "Admins can update member roles"
ON public.organization_members
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
  )
)
WITH CHECK (
  -- Cannot modify your own row
  user_id <> auth.uid()
  -- Only allow assigning 'member' or 'admin' roles
  AND role IN ('member', 'admin')
  -- Must still be in the same org (prevent org hopping)
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
  )
);
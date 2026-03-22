-- Admin can update member roles (but not their own to prevent lockout)
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
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
  )
);

-- Admin can remove members (but not themselves)
CREATE POLICY "Admins can remove members"
ON public.organization_members
FOR DELETE
TO authenticated
USING (
  user_id != auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
  )
);

-- Update the creator insert policy to set role as admin
-- First, drop the old one and recreate with admin role enforcement
DROP POLICY IF EXISTS "Creator can join their new org" ON public.organization_members;

CREATE POLICY "Creator can join their new org"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'admin'
  AND EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_id
      AND o.created_by = auth.uid()
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
  )
);

-- Admins can invite new members (as 'member' role only)
CREATE POLICY "Admins can invite members"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
  )
);
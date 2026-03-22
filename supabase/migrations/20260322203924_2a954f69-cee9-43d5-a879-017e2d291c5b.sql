-- Fix 1: Organization INSERT policy - broken self-referencing condition
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;

CREATE POLICY "Authenticated users can create organizations"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (true);
-- Any authenticated user can create an org. Membership is controlled separately.

-- Fix 2: organization_members INSERT - restrict to org creators only
-- Users can only add themselves as member if:
--   a) They are the FIRST member (creating a new org), OR
--   b) They are already an admin/owner of that org (inviting others - future)
DROP POLICY IF EXISTS "Authenticated users can join orgs they create" ON public.organization_members;

CREATE POLICY "Users can join orgs with no existing members"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = organization_members.organization_id
  )
);
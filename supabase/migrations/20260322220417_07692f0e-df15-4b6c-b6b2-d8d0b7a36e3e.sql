
-- 1. Add created_by column to organizations
ALTER TABLE public.organizations ADD COLUMN created_by uuid;

-- 2. Drop the vulnerable policy
DROP POLICY IF EXISTS "Users can join orgs with no existing members" ON public.organization_members;

-- 3. Create a secure policy: users can only join orgs they created, and only if no members exist yet
CREATE POLICY "Creator can join their new org"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
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

-- Migrate existing 'owner' roles to 'admin' for consistency with new policies
UPDATE public.organization_members SET role = 'admin' WHERE role = 'owner';
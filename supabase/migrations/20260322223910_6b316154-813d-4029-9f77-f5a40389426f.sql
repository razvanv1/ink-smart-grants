-- Deny all direct access to rate_limits for authenticated users.
-- The table is only accessed via the check_rate_limit() SECURITY DEFINER function.
CREATE POLICY "Deny all direct access"
ON public.rate_limits
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);
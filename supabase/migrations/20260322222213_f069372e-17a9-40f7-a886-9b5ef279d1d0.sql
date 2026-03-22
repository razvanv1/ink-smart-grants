CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _ip text,
  _endpoint text,
  _max_requests int,
  _window_interval interval
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count int;
BEGIN
  INSERT INTO rate_limits (ip_address, endpoint, request_count, window_start)
  VALUES (_ip, _endpoint, 1, now())
  ON CONFLICT (ip_address, endpoint)
  DO UPDATE SET
    request_count = CASE
      WHEN rate_limits.window_start < now() - _window_interval
      THEN 1
      ELSE rate_limits.request_count + 1
    END,
    window_start = CASE
      WHEN rate_limits.window_start < now() - _window_interval
      THEN now()
      ELSE rate_limits.window_start
    END
  RETURNING request_count INTO _count;

  RETURN _count <= _max_requests;
END;
$$;
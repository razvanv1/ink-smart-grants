import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { InkLogo } from "@/components/InkLogo";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pre-fill email from query params (from public scan unlock)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
    // If coming from public scan, default to signup
    const redirect = params.get("redirect");
    if (redirect && emailParam) setMode("signup");
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Password reset link sent." });
        setMode("login");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({ title: "Verifică emailul", description: "Ți-am trimis un link de confirmare. Verifică inbox-ul (și spam) pentru a-ți activa contul.", duration: 10000 });
        setMode("login");
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result && "error" in result && result.error) {
        throw result.error;
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-info/[0.08] to-transparent" />
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full border border-info/20" />
        <div className="absolute top-14 right-[8%] w-24 h-24 rounded-[8px] border border-info/20 rotate-[12deg]" />
      </div>
      <div className="w-full max-w-[400px] bg-card border border-border rounded-[10px] shadow-xl shadow-foreground/[0.06] p-6 sm:p-7 relative z-10">
        {/* Brand */}
        <div className="mb-8">
          <InkLogo size={34} showTagline />
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">
          {mode === "forgot" ? "Reset password" : mode === "signup" ? "Create account" : "Sign in"}
        </h1>
        <p className="text-[13px] text-muted-foreground mb-8">
          {mode === "forgot"
            ? "Enter your email to receive a reset link."
            : mode === "signup"
            ? "A smart funding operations platform that monitors opportunities, selects the best grants, builds proposals faster with smart agents."
            : "Welcome back to INK Smart Grants."}
        </p>

        {mode !== "forgot" && (
          <>
            <div className="flex gap-3 mb-6">
              <Button
                variant="outline"
                className="flex-1 h-10 text-[13px]"
                onClick={() => handleOAuth("google")}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-10 text-[13px]"
                onClick={() => handleOAuth("apple")}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Apple
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          </>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 text-[13px]"
          />
          {mode !== "forgot" && (
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-10 text-[13px]"
            />
          )}
          <Button type="submit" className="w-full h-10 text-[13px] font-medium bg-info text-info-foreground hover:bg-info/90" disabled={loading}>
            {loading ? "…" : mode === "forgot" ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <div className="mt-5 text-center space-y-1">
          {mode === "login" && (
            <>
              <button onClick={() => setMode("forgot")} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </button>
              <p className="text-[12px] text-muted-foreground">
                No account?{" "}
                <button onClick={() => setMode("signup")} className="text-info font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            </>
          )}
          {mode === "signup" && (
            <p className="text-[12px] text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-info font-semibold hover:underline">
                Sign in
              </button>
            </p>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("login")} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

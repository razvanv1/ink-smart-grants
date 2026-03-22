import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommandPalette } from "@/components/CommandPalette";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const OpportunityDetail = lazy(() => import("./pages/OpportunityDetail"));
const Workflows = lazy(() => import("./pages/Workflows"));
const WorkflowDetail = lazy(() => import("./pages/WorkflowDetail"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const KnowledgeVault = lazy(() => import("./pages/KnowledgeVault"));
const AgentActivity = lazy(() => import("./pages/AgentActivity"));
const AgentTasks = lazy(() => import("./pages/AgentTasks"));
const AgentTaskDetail = lazy(() => import("./pages/AgentTaskDetail"));
const FundingProfile = lazy(() => import("./pages/FundingProfile"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const PublicScan = lazy(() => import("./pages/PublicScan"));
const ScanPage = lazy(() => import("./pages/Scan"));
const Contact = lazy(() => import("./pages/Contact"));

const queryClient = new QueryClient();

function ProtectedRoute({ children, skipOrgCheck }: { children: React.ReactNode; skipOrgCheck?: boolean }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const { data: orgId, isLoading: orgLoading } = useQuery({
    queryKey: ['user-org-check', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
      return data?.organization_id ?? null;
    },
    enabled: !!user && !skipOrgCheck,
    staleTime: 1000 * 60 * 5,
  });

  if (loading || (!skipOrgCheck && orgLoading)) {
    return <div className="min-h-screen flex items-center justify-center"><div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!user) return <Navigate to="/landing" replace />;
  if (!skipOrgCheck && !orgId && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  const fallback = <div className="min-h-screen flex items-center justify-center"><div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  if (loading) return fallback;

  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to={new URLSearchParams(window.location.search).get("redirect") || "/"} replace /> : <Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/scan-public" element={user ? <Navigate to="/" replace /> : <PublicScan />} />
        <Route path="/landing" element={user ? <Navigate to="/" replace /> : <PublicScan />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/onboarding" element={<ProtectedRoute skipOrgCheck><Onboarding /></ProtectedRoute>} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CommandPalette />
                <Suspense fallback={fallback}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/opportunities" element={<Opportunities />} />
                    <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                    <Route path="/workflows" element={<Workflows />} />
                    <Route path="/workflows/:id" element={<WorkflowDetail />} />
                    <Route path="/pipeline" element={<Pipeline />} />
                    <Route path="/knowledge-vault" element={<KnowledgeVault />} />
                    <Route path="/agent-activity" element={<AgentActivity />} />
                    <Route path="/agent-tasks" element={<AgentTasks />} />
                    <Route path="/agent-tasks/:taskId" element={<AgentTaskDetail />} />
                    <Route path="/funding-profile" element={<FundingProfile />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommandPalette } from "@/components/CommandPalette";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import Workflows from "./pages/Workflows";
import WorkflowDetail from "./pages/WorkflowDetail";
import Pipeline from "./pages/Pipeline";
import KnowledgeVault from "./pages/KnowledgeVault";
import AgentActivity from "./pages/AgentActivity";
import FundingProfile from "./pages/FundingProfile";
import SettingsPage from "./pages/Settings";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import PublicScan from "./pages/PublicScan";
import ScanPage from "./pages/Scan";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/landing" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to={new URLSearchParams(window.location.search).get("redirect") || "/"} replace /> : <Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/scan-public" element={user ? <Navigate to="/" replace /> : <PublicScan />} />
      <Route path="/landing" element={user ? <Navigate to="/" replace /> : <PublicScan />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CommandPalette />
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
                <Route path="/funding-profile" element={<FundingProfile />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
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

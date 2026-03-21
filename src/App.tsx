import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

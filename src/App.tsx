import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { MedicationProvider } from "@/contexts/MedicationContext";
import AuthPage from "./pages/AuthPage";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import MedicationsPage from "./pages/MedicationsPage";
import DrugInfoPage from "./pages/DrugInfoPage";
import InteractionsPage from "./pages/InteractionsPage";
import RemindersPage from "./pages/RemindersPage";
import ProfilePage from "./pages/ProfilePage";
import DemoProfilesPage from "./pages/DemoProfilesPage";
import FeedbackPage from "./pages/FeedbackPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <MedicationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/medications" element={<MedicationsPage />} />
                  <Route path="/drug-info" element={<DrugInfoPage />} />
                  <Route path="/interactions" element={<InteractionsPage />} />
                  <Route path="/reminders" element={<RemindersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/demo-profiles" element={<DemoProfilesPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </MedicationProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

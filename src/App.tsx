import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoanProvider } from "@/contexts/LoanContext";
import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ApplyLoan from './pages/ApplyLoan';
import MyApplications from "./pages/MyApplications";

const queryClient = new QueryClient();

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LoanProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-background">
                  <Header isDark={isDark} toggleTheme={toggleTheme} />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/apply-loan"
                    element={
                      <ProtectedRoute>
                        <ApplyLoan />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-applications"
                    element={
                      <ProtectedRoute>
                        <MyApplications />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/my-application" element={<Navigate to="/my-applications" replace />} />
                  <Route path="/applications" element={<Navigate to="/my-applications" replace />} />
                  <Route path="/application" element={<Navigate to="/my-applications" replace />} />
                  <Route path="/ekyc" element={<Navigate to="/profile" />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
          </LoanProvider>
        </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

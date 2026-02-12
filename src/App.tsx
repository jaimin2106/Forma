
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import ResetPassword from "./pages/ResetPassword";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import FormBuilder from "./pages/FormBuilder";
import NotFound from "./pages/NotFound";
import PublicForm from "./pages/PublicForm";
import FormResponses from "./pages/FormResponses";

import Pricing from "./pages/Pricing";
import Enterprise from "./pages/Enterprise";
import Features from "./pages/platform/Features";
import Integrations from "./pages/platform/Integrations";
import API from "./pages/platform/API";
import Marketing from "./pages/solutions/Marketing";
import Product from "./pages/solutions/Product";
import HR from "./pages/solutions/HR";
import Blog from "./pages/resources/Blog";
import HelpCenter from "./pages/resources/HelpCenter";
import Community from "./pages/resources/Community";
import { CookieBanner } from "./components/legal/CookieBanner";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    // Hide navbar on App routes (Dashboard, Auth, Forms, ResetPassword)
    const hideNavbarRoutes = ['/dashboard', '/auth', '/forms', '/reset-password'];
    const showNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {showNavbar && <Navbar />}
        <main className={`flex-1 ${showNavbar ? 'pt-[80px]' : ''}`}>
          {children}
        </main>
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/enterprise" element={<Enterprise />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* Platform Routes */}
                <Route path="/platform/features" element={<Features />} />
                <Route path="/platform/integrations" element={<Integrations />} />
                <Route path="/platform/api" element={<API />} />

                {/* Solutions Routes */}
                <Route path="/solutions/marketing" element={<Marketing />} />
                <Route path="/solutions/product" element={<Product />} />
                <Route path="/solutions/hr" element={<HR />} />

                {/* Resources Routes */}
                <Route path="/resources/blog" element={<Blog />} />
                <Route path="/resources/help" element={<HelpCenter />} />
                <Route path="/resources/community" element={<Community />} />

                <Route path="/forms/new" element={<FormBuilder />} />
                <Route path="/forms/:id/edit" element={<FormBuilder />} />
                <Route path="/forms/:id/view" element={<PublicForm />} />
                <Route path="/forms/:id/responses" element={<FormResponses />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <CookieBanner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

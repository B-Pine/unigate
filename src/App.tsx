import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Public pages
import Index from "./pages/Index";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import FacultyRecommendation from "./pages/FacultyRecommendation";
import PastPapers from "./pages/PastPapers";
import CareerAdvice from "./pages/CareerAdvice";
import Auth from "./pages/Auth";
import Bookmarks from "./pages/Bookmarks";
import NotFound from "./pages/NotFound";

// Admin dashboard
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminScholarships from "./pages/admin/AdminScholarships";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminPastPapers from "./pages/admin/AdminPastPapers";
import AdminTimeSlots from "./pages/admin/AdminTimeSlots";
import AdminAdviceSessions from "./pages/admin/AdminAdviceSessions";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFacultyFinder from "./pages/admin/AdminFacultyFinder";
import AdminPayments from "./pages/admin/AdminPayments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/faculty-recommendation" element={<FacultyRecommendation />} />
          <Route path="/past-papers" element={<PastPapers />} />
          <Route path="/career-advice" element={<CareerAdvice />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />

          {/* Admin dashboard */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="scholarships" element={<AdminScholarships />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="past-papers" element={<AdminPastPapers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="time-slots" element={<AdminTimeSlots />} />
            <Route path="advice-sessions" element={<AdminAdviceSessions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="faculty-finder" element={<AdminFacultyFinder />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

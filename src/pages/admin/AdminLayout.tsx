import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { LayoutDashboard, GraduationCap, Briefcase, FileText, Clock, MessageSquare, Users, BookOpen, CreditCard } from "lucide-react";

export default function AdminLayout() {
  const { data: stats } = useAdminStats();

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Scholarships", href: "/admin/scholarships", icon: GraduationCap },
    { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "Past Papers", href: "/admin/past-papers", icon: FileText },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Time Slots", href: "/admin/time-slots", icon: Clock },
    { label: "Advice Sessions", href: "/admin/advice-sessions", icon: MessageSquare, badge: stats?.pendingSessions },
    { label: "Faculty Finder", href: "/admin/faculty-finder", icon: BookOpen },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Admin Panel">
      <Outlet />
    </DashboardLayout>
  );
}

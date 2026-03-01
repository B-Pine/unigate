import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Home, GraduationCap, Briefcase, FileText, MessageSquare, Bookmark } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Scholarships", href: "/dashboard/scholarships", icon: GraduationCap },
  { label: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { label: "Past Papers", href: "/dashboard/past-papers", icon: FileText },
  { label: "Advice Sessions", href: "/dashboard/advice", icon: MessageSquare },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
];

export default function StudentLayout() {
  return (
    <DashboardLayout navItems={navItems} title="Student Dashboard" showWhatsApp>
      <Outlet />
    </DashboardLayout>
  );
}

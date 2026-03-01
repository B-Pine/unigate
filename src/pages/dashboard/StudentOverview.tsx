import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useMyAdviceSessions } from "@/hooks/use-advice-sessions";
import { GraduationCap, FileText, MessageSquare } from "lucide-react";

export default function StudentOverview() {
  const { user } = useAuth();
  const { data: bookmarks } = useBookmarks();
  const { data: sessions } = useMyAdviceSessions();

  const pendingSessions = sessions?.filter((s) => s.status === "pending").length || 0;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 6 }}>
        Welcome back, {user?.name}
      </h2>
      <p style={{ fontSize: 13, color: "hsl(0,0%,50%)", marginBottom: 24 }}>
        Here is a summary of your activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-card-value">{bookmarks?.length || 0}</div>
          <div className="stat-card-label">Bookmarked Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{pendingSessions}</div>
          <div className="stat-card-label">Pending Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{sessions?.length || 0}</div>
          <div className="stat-card-label">Total Sessions</div>
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 12 }}>Quick Links</h3>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Browse Scholarships", href: "/dashboard/scholarships", icon: GraduationCap },
          { label: "Past Papers", href: "/dashboard/past-papers", icon: FileText },
          { label: "Book Advice Session", href: "/dashboard/advice", icon: MessageSquare },
        ].map((link) => (
          <Link
            key={link.href}
            to={link.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              fontSize: 13,
              color: "hsl(216,64%,28%)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <link.icon size={15} />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { Users, GraduationCap, Briefcase, FileText, Clock, MessageSquare, AlertCircle, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCard {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  href?: string;
}

export default function AdminOverview() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useAdminStats();

  const cards: StatCard[] = [
    { label: "Total Users", value: stats?.users, icon: Users, color: "hsl(216,64%,28%)", bgColor: "hsl(216,64%,95%)" },
    { label: "Scholarships", value: stats?.scholarships, icon: GraduationCap, color: "hsl(140,45%,32%)", bgColor: "hsl(140,45%,94%)", href: "/admin/scholarships" },
    { label: "Jobs", value: stats?.jobs, icon: Briefcase, color: "hsl(262,50%,45%)", bgColor: "hsl(262,50%,95%)", href: "/admin/jobs" },
    { label: "Past Papers", value: stats?.pastPapers, icon: FileText, color: "hsl(38,80%,42%)", bgColor: "hsl(38,80%,93%)", href: "/admin/past-papers" },
    { label: "Time Slots", value: stats?.timeSlots, icon: Clock, color: "hsl(190,60%,38%)", bgColor: "hsl(190,60%,93%)", href: "/admin/time-slots" },
    { label: "Total Sessions", value: stats?.sessions, icon: MessageSquare, color: "hsl(216,64%,28%)", bgColor: "hsl(216,64%,95%)", href: "/admin/advice-sessions" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Welcome banner */}
      <div className="overview-welcome">
        <div>
          <h2 className="overview-welcome-title">{greeting}, {user?.name?.split(" ")[0] || "Admin"}</h2>
          <p className="overview-welcome-sub">Here is what is happening across your platform today.</p>
        </div>
      </div>

      {/* Pending alert */}
      {stats?.pendingSessions !== undefined && stats.pendingSessions > 0 && (
        <Link to="/admin/advice-sessions" className="overview-alert">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, backgroundColor: "hsl(38,80%,90%)" }}>
              <AlertCircle size={16} style={{ color: "hsl(38,80%,42%)" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(38,40%,25%)" }}>
                {stats.pendingSessions} pending advice session{stats.pendingSessions > 1 ? "s" : ""}
              </div>
              <div style={{ fontSize: 11, color: "hsl(38,30%,45%)" }}>Require your review</div>
            </div>
          </div>
          <ArrowRight size={16} style={{ color: "hsl(38,60%,45%)" }} />
        </Link>
      )}

      {/* Stat cards */}
      {isLoading ? (
        <div className="overview-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overview-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="overview-card-skeleton-value" />
                  <div className="overview-card-skeleton-label" />
                </div>
                <div className="overview-card-skeleton-icon" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overview-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            const inner = (
              <div className="overview-card" key={card.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="overview-card-value" style={{ color: card.color }}>
                      {card.value ?? 0}
                    </div>
                    <div className="overview-card-label">{card.label}</div>
                  </div>
                  <div className="overview-card-icon" style={{ backgroundColor: card.bgColor }}>
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                </div>
                {card.href && (
                  <div className="overview-card-footer">
                    <span>Manage</span>
                    <ArrowRight size={12} />
                  </div>
                )}
              </div>
            );
            return card.href ? (
              <Link key={card.label} to={card.href} style={{ textDecoration: "none", color: "inherit" }}>
                {inner}
              </Link>
            ) : (
              <div key={card.label}>{inner}</div>
            );
          })}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "hsl(0,0%,25%)", marginBottom: 12 }}>Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          <Link to="/admin/scholarships" className="quick-action-card">
            <GraduationCap size={18} style={{ color: "hsl(140,45%,32%)" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Add Scholarship</div>
              <div style={{ fontSize: 11, color: "hsl(0,0%,55%)" }}>Create a new scholarship listing</div>
            </div>
          </Link>
          <Link to="/admin/jobs" className="quick-action-card">
            <Briefcase size={18} style={{ color: "hsl(262,50%,45%)" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Add Job</div>
              <div style={{ fontSize: 11, color: "hsl(0,0%,55%)" }}>Post a new job opportunity</div>
            </div>
          </Link>
          <Link to="/admin/past-papers" className="quick-action-card">
            <FileText size={18} style={{ color: "hsl(38,80%,42%)" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Upload Paper</div>
              <div style={{ fontSize: 11, color: "hsl(0,0%,55%)" }}>Add a past examination paper</div>
            </div>
          </Link>
          <Link to="/admin/time-slots" className="quick-action-card">
            <Clock size={18} style={{ color: "hsl(190,60%,38%)" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Manage Slots</div>
              <div style={{ fontSize: 11, color: "hsl(0,0%,55%)" }}>Configure advice session times</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LucideIcon, ExternalLink, LogOut, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
  showWhatsApp?: boolean;
}

export function DashboardLayout({ children, navItems, title, showWhatsApp = false }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentPage = navItems.find((item) => item.href === location.pathname);
  const pageTitle = currentPage?.label || title;

  const sidebarWidth = collapsed ? 68 : 248;

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside className="dashboard-sidebar" style={{ width: sidebarWidth, transition: "width 0.2s ease" }}>
          {/* Logo area */}
          <div className="sidebar-logo-area">
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <div className="sidebar-logo-icon">U</div>
              {!collapsed && (
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", lineHeight: 1 }}>
                    UNIGATE
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {title}
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav style={{ padding: "12px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`sidebar-nav-item ${isActive ? "sidebar-nav-active" : ""}`}
                  title={collapsed ? item.label : undefined}
                  style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="sidebar-bottom">
            {/* Back to website */}
            <Link
              to="/"
              className="sidebar-back-link"
              title={collapsed ? "Back to Website" : undefined}
              style={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              <ExternalLink size={16} style={{ flexShrink: 0 }} />
              {!collapsed && <span>Back to Website</span>}
            </Link>

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="sidebar-collapse-btn"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              {!collapsed && <span>Collapse</span>}
            </button>

            {/* User section */}
            <div className="sidebar-user-section">
              <div className="sidebar-user-avatar">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              {!collapsed && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {user?.role}
                  </div>
                </div>
              )}
              {!collapsed && (
                <button onClick={handleLogout} className="sidebar-logout-btn" title="Sign out">
                  <LogOut size={15} />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {/* Top header bar */}
          <header className="dashboard-header">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <h1 className="dashboard-page-title">{pageTitle}</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="dashboard-search-box">
                <Search size={14} style={{ color: "hsl(0,0%,55%)", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dashboard-search-input"
                />
              </div>
              <div className="dashboard-header-user">
                <div className="dashboard-header-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "hsl(0,0%,30%)" }}>{user?.name}</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="dashboard-main">
            {children}
          </main>
        </div>
      </div>
      {showWhatsApp && <WhatsAppFloat />}
    </>
  );
}

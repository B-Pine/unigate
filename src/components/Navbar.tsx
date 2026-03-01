import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Heart, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Scholarships", href: "/scholarships" },
  { label: "Jobs", href: "/jobs" },
  { label: "Faculties", href: "/faculty-recommendation" },
  { label: "Past Papers", href: "/past-papers" },
  { label: "Career Advice", href: "/career-advice" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="uni-navbar">
      {/* Top utility bar */}
      <div className="uni-navbar-top">
        <div className="uni-container">
          <span>University & Career Opportunity Portal</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="mailto:info@unigate.rw" style={{ color: "inherit", textDecoration: "none" }}>info@unigate.rw</a>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>+250 782 987 977</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="uni-navbar-main">
        <div className="uni-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link to="/" className="uni-navbar-brand">
            <img src="/logo.png" alt="Unigate" className="uni-navbar-logo" />
            <div>
              <div className="uni-navbar-brand-name">UNIGATE</div>
              <div className="uni-navbar-brand-tagline">Opportunity Portal</div>
            </div>
          </Link>

          {/* Desktop navigation links */}
          <nav className="uni-navbar-links">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`uni-navbar-link ${isActive ? "uni-navbar-link-active" : ""}`}
                >
                  {link.label}
                  {isActive && <span className="uni-navbar-link-indicator" />}
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth actions */}
          <div className="uni-navbar-actions">
            {user ? (
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button
                  className="uni-navbar-user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="uni-navbar-user-avatar">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                  <span className="uni-navbar-user-name">{user.name?.split(" ")[0]}</span>
                  <ChevronDown size={14} style={{ opacity: 0.6 }} />
                </button>
                {userMenuOpen && (
                  <div className="uni-navbar-dropdown">
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{user.email}</div>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="uni-navbar-dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/bookmarks"
                      className="uni-navbar-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Heart size={15} />
                      My Bookmarks
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="uni-navbar-dropdown-item"
                      style={{ width: "100%", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link to="/auth" className="uni-navbar-signin">Sign In</Link>
                <Link to="/auth" className="uni-navbar-register">Register</Link>
              </div>
            )}

            <button
              className="uni-navbar-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="uni-navbar-mobile">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`uni-navbar-mobile-link ${isActive ? "uni-navbar-mobile-link-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
          <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 4, paddingTop: 8 }}>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="uni-navbar-mobile-link">
                    Dashboard
                  </Link>
                )}
                <Link to="/bookmarks" onClick={() => setMobileOpen(false)} className="uni-navbar-mobile-link">
                  My Bookmarks
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="uni-navbar-mobile-link"
                  style={{ width: "100%", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="uni-navbar-mobile-link">
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

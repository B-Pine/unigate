import { useParams, Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { useScholarship } from "@/hooks/use-scholarships";
import { ArrowLeft, Calendar, MapPin, Building2, ExternalLink, Volume2, MessageCircle } from "lucide-react";
import { WhatsAppGroupBanner } from "@/components/WhatsAppGroupBanner";
import DOMPurify from "dompurify";

const SOCIAL_LINKS = {
  youtube: "https://youtube.com/@YourChannel",
  twitter: "https://x.com/YourHandle",
  linkedin: "https://linkedin.com/company/YourCompany",
};

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK";

const ScholarshipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scholarship, isLoading } = useScholarship(Number(id));

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="uni-page-header">
          <div className="uni-container">
            <div className="uni-breadcrumb">
              <Link to="/">Home</Link> / <Link to="/scholarships">Scholarships</Link>
            </div>
            <h1>Loading...</h1>
          </div>
        </div>
        <div className="uni-page-content">
          <div className="uni-container">
            <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280", fontSize: 14 }}>
              Loading scholarship details...
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!scholarship) {
    return (
      <PublicLayout>
        <div className="uni-page-header">
          <div className="uni-container">
            <div className="uni-breadcrumb">
              <Link to="/">Home</Link> / <Link to="/scholarships">Scholarships</Link>
            </div>
            <h1>Scholarship Not Found</h1>
          </div>
        </div>
        <div className="uni-page-content">
          <div className="uni-container">
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>This scholarship could not be found.</p>
              <Link to="/scholarships" className="uni-btn-primary">Back to Scholarships</Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const deadlineDate = scholarship.deadline ? new Date(scholarship.deadline) : null;
  if (deadlineDate) deadlineDate.setHours(0, 0, 0, 0);
  const isExpired = deadlineDate && deadlineDate < now;
  const actualStatus = isExpired ? "Closed" : scholarship.status;

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <div className="uni-breadcrumb">
            <Link to="/">Home</Link> / <Link to="/scholarships">Scholarships</Link> / {scholarship.title}
          </div>
          <h1>{scholarship.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            <span className={`uni-badge ${actualStatus === "Open" ? "uni-badge-open" : "uni-badge-closed"}`}>
              {actualStatus}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              <Building2 size={14} /> {scholarship.university}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              <MapPin size={14} /> {scholarship.country}
            </span>
            {scholarship.deadline && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                <Calendar size={14} /> Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="uni-page-content">
        <div className="uni-container">
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <Link to="/scholarships" className="uni-btn-outline" style={{ fontSize: 13, padding: "6px 14px", gap: 6 }}>
              <ArrowLeft size={14} /> Back to Scholarships
            </Link>
          </div>

          <div className="uni-detail-layout">
            {/* Main content */}
            <div className="uni-detail-main">
              {/* Image */}
              {scholarship.image_url && (
                <div className="uni-detail-image">
                  <img src={scholarship.image_url} alt={scholarship.title} />
                </div>
              )}

              {/* Audio */}
              {scholarship.audio_url && (
                <div className="uni-detail-audio">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Volume2 size={16} style={{ color: "hsl(216, 64%, 28%)" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Audio Description</span>
                  </div>
                  <audio controls style={{ width: "100%" }}>
                    <source src={scholarship.audio_url} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Description */}
              {scholarship.description && (
                <div className="uni-detail-section">
                  <h2>Description</h2>
                  <div className="uni-rich-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(scholarship.description) }} />
                </div>
              )}

              {/* Requirements */}
              {scholarship.requirements && (
                <div className="uni-detail-section">
                  <h2>Requirements</h2>
                  <div className="uni-rich-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(scholarship.requirements) }} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="uni-detail-sidebar">
              <div className="uni-card">
                <div className="uni-card-body">
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Quick Info</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>University</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#111827", marginTop: 2 }}>{scholarship.university}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Country</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#111827", marginTop: 2 }}>{scholarship.country}</div>
                    </div>
                    {scholarship.deadline && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Deadline</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#111827", marginTop: 2 }}>{new Date(scholarship.deadline).toLocaleDateString()}</div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
                      <span className={`uni-badge ${actualStatus === "Open" ? "uni-badge-open" : "uni-badge-closed"}`} style={{ marginTop: 4 }}>
                        {actualStatus}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 20, paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    {scholarship.form_link && (
                      <a
                        href={scholarship.form_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uni-btn-primary"
                        style={{ fontSize: 13, padding: "10px 20px", textAlign: "center", gap: 6 }}
                      >
                        <ExternalLink size={14} /> Apply via Form
                      </a>
                    )}
                    {scholarship.platform_link && (
                      <a
                        href={scholarship.platform_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uni-btn-outline"
                        style={{ fontSize: 13, padding: "9px 20px", textAlign: "center", gap: 6 }}
                      >
                        <ExternalLink size={14} /> Visit Platform
                      </a>
                    )}
                  </div>

                  {/* WhatsApp Group */}
                  <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 20, paddingTop: 20 }}>
                    <a
                      href={WHATSAPP_GROUP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        backgroundColor: "#dcfce7",
                        borderRadius: 8,
                        textDecoration: "none",
                        transition: "background-color 0.15s",
                      }}
                    >
                      <MessageCircle size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>Join WhatsApp Group</div>
                        <div style={{ fontSize: 11, color: "#4ade80", marginTop: 1 }}>Get instant updates</div>
                      </div>
                    </a>
                  </div>

                  {/* Social Media */}
                  <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 16, paddingTop: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Follow Us</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
                        style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626", textDecoration: "none" }}
                        title="YouTube">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                      </a>
                      <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
                        style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#111827", textDecoration: "none" }}
                        title="X (Twitter)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      </a>
                      <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
                        style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", textDecoration: "none" }}
                        title="LinkedIn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Group CTA */}
      <WhatsAppGroupBanner />
    </PublicLayout>
  );
};

export default ScholarshipDetail;

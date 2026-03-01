import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { ArrowRight, GraduationCap, Briefcase, FileText, Users, CalendarDays, MessageCircle } from "lucide-react";
import { useScholarships } from "@/hooks/use-scholarships";
import { useJobs } from "@/hooks/use-jobs";
import { useAdviceSessionCount } from "@/hooks/use-advice-sessions";

const SOCIAL_LINKS = {
  youtube: "https://youtube.com/@YourChannel",
  twitter: "https://x.com/YourHandle",
  linkedin: "https://linkedin.com/company/YourCompany",
};

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK";

function stripHtml(html: string | null) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

interface HeroSlide {
  type: "scholarship" | "job";
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  link: string;
}

const FALLBACK_BG = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80";

const Index = () => {
  const { data: scholarshipData } = useScholarships({ limit: 3 });
  const { data: jobData } = useJobs({ limit: 3 });
  const { data: adviceSessionCount } = useAdviceSessionCount();

  const scholarships = scholarshipData?.data || [];
  const jobs = jobData?.data || [];
  const totalScholarships = scholarshipData?.total ?? scholarships.length;
  const totalJobs = jobData?.total ?? jobs.length;
  const completedAdviceSessions = adviceSessionCount?.count ?? 0;

  // Build carousel slides: 2 scholarships + 1 job (most recent)
  const slides: HeroSlide[] = [];
  scholarships.slice(0, 2).forEach((s) => {
    slides.push({ type: "scholarship", id: s.id, title: s.title, description: s.description, image_url: s.image_url, link: `/scholarships/${s.id}` });
  });
  jobs.slice(0, 1).forEach((j) => {
    slides.push({ type: "job", id: j.id, title: j.title, description: j.description, image_url: j.image_url, link: `/jobs/${j.id}` });
  });

  const [current, setCurrent] = useState(0);
  const slideCount = slides.length || 1;

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext, slideCount]);

  const activeSlide = slides[current] || null;
  const bgImage = activeSlide?.image_url || FALLBACK_BG;

  return (
    <PublicLayout>
      {/* Hero Carousel */}
      <section className="uni-hero" style={{ backgroundImage: `url('${bgImage}')` }}>
        <div className="uni-hero-content">
          <div className="uni-container" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div className="uni-hero-overline">
              <GraduationCap size={14} />
              University & Career Opportunity Portal
            </div>
            {activeSlide ? (
              <>
                <h1 key={activeSlide.id} className="uni-hero-slide-text">{activeSlide.title}</h1>
                {activeSlide.description && (
                  <p key={`desc-${activeSlide.id}`} className="uni-hero-desc uni-hero-slide-text" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {stripHtml(activeSlide.description)}
                  </p>
                )}
                <div className="uni-hero-actions">
                  <Link to={activeSlide.link} className="uni-hero-btn-primary">
                    Saba ubufasha <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1>Your Gateway to Academic Excellence & Career Growth</h1>
                <p className="uni-hero-desc">
                  Discover scholarships, job opportunities, faculty recommendations, and career guidance — all in one trusted platform built for students and graduates in Rwanda and beyond.
                </p>
                <div className="uni-hero-actions">
                  <Link to="/scholarships" className="uni-hero-btn-primary">
                    Explore Scholarships <ArrowRight size={16} />
                  </Link>
                  <Link to="/jobs" className="uni-hero-btn-secondary">
                    Browse Jobs
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Carousel navigation */}
        {slides.length > 1 && (
          <>
            <div className="uni-hero-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`uni-hero-dot${i === current ? " uni-hero-dot-active" : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Stats bar */}
      <section className="uni-stats-bar">
        <div className="uni-container">
          <div className="uni-stats-grid">
            {[
              { label: "Students Assisted", value: "4,200+" },
              { label: "Scholarships Posted", value: totalScholarships.toString() },
              { label: "Job Listings", value: totalJobs.toString() },
              { label: "Advice Sessions", value: completedAdviceSessions.toString() },
            ].map((stat) => (
              <div key={stat.label} className="uni-stat-item">
                <div className="uni-stat-value">{stat.value}</div>
                <div className="uni-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Scholarships + Social Sidebar */}
      <section className="uni-section">
        <div className="uni-container">
          <div className="uni-section-heading">
            <h2>Featured Scholarships</h2>
            <Link to="/scholarships">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="uni-featured-layout">
            {/* Scholarship cards */}
            <div className="uni-featured-cards">
              {scholarships.map((s) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const deadlineDate = s.deadline ? new Date(s.deadline) : null;
                if (deadlineDate) deadlineDate.setHours(0, 0, 0, 0);
                const isExpired = deadlineDate && deadlineDate < now;
                const actualStatus = isExpired ? "Closed" : s.status;

                return (
                  <Link to={`/scholarships/${s.id}`} key={s.id} className="uni-opportunity-card uni-featured-scholarship-card">
                    <div className="uni-featured-scholarship-img">
                      <img
                        src={s.image_url || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"}
                        alt={s.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div className="uni-featured-scholarship-body">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="uni-opportunity-card-title" style={{ flex: 1 }}>{s.title}</div>
                        <span className={`uni-badge ${actualStatus === "Open" ? "uni-badge-open" : "uni-badge-closed"}`} style={{ flexShrink: 0 }}>
                          {actualStatus}
                        </span>
                      </div>
                      <div className="uni-opportunity-card-meta">
                        <GraduationCap size={13} /> {s.university}
                      </div>
                      {s.deadline && (
                        <div className="uni-opportunity-card-deadline">
                          Deadline: {new Date(s.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
              {scholarships.length === 0 && (
                <div style={{ color: "#6b7280", fontSize: 13, padding: 16 }}>
                  Loading scholarships...
                </div>
              )}
            </div>

            {/* Social sidebar */}
            <div className="uni-social-sidebar">
              {/* WhatsApp Group */}
              <div style={{
                background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
                borderRadius: 10,
                padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <MessageCircle size={20} style={{ color: "#fff" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                      Join Our WhatsApp Group
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                      Get instant updates on scholarships & jobs
                    </div>
                  </div>
                </div>
                <a
                  href={WHATSAPP_GROUP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    backgroundColor: "#fff",
                    color: "#128C7E",
                    padding: "9px 16px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    width: "100%",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#128C7E">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Join Now
                </a>
              </div>

              {/* Social Media Follow */}
              <div style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 20,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  Follow Us
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
                  Stay connected for the latest updates
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 12px", borderRadius: 8,
                      backgroundColor: "#fef2f2", border: "1px solid #fecaca",
                      color: "#111827", fontSize: 13, fontWeight: 500,
                      textDecoration: "none", transition: "border-color 0.2s",
                    }}
                  >
                    <span style={{ color: "#dc2626" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    </span>
                    YouTube
                  </a>
                  <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 12px", borderRadius: 8,
                      backgroundColor: "#f9fafb", border: "1px solid #e5e7eb",
                      color: "#111827", fontSize: 13, fontWeight: 500,
                      textDecoration: "none", transition: "border-color 0.2s",
                    }}
                  >
                    <span style={{ color: "#111827" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </span>
                    X (Twitter)
                  </a>
                  <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 12px", borderRadius: 8,
                      backgroundColor: "#eff6ff", border: "1px solid #bfdbfe",
                      color: "#111827", fontSize: 13, fontWeight: 500,
                      textDecoration: "none", transition: "border-color 0.2s",
                    }}
                  >
                    <span style={{ color: "#2563eb" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    </span>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="uni-section-alt">
        <div className="uni-container">
          <div className="uni-section-heading">
            <h2>Latest Job Opportunities</h2>
            <Link to="/jobs">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="uni-card-grid">
            {jobs.map((j) => {
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              const deadlineDate = j.deadline ? new Date(j.deadline) : null;
              if (deadlineDate) deadlineDate.setHours(0, 0, 0, 0);
              const isExpired = deadlineDate && deadlineDate < now;
              const actualStatus = isExpired ? "Closed" : j.status;

              return (
                <Link to={`/jobs/${j.id}`} key={j.id} className="uni-opportunity-card">
                  <div className="uni-opportunity-card-image">
                    <img
                      src={j.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"}
                      alt={j.title}
                    />
                    <span className={`uni-badge ${actualStatus === "Open" ? "uni-badge-open" : "uni-badge-closed"}`}>
                      {actualStatus}
                    </span>
                  </div>
                  <div className="uni-opportunity-card-body">
                    <div className="uni-opportunity-card-title">{j.title}</div>
                    <div className="uni-opportunity-card-meta">
                      <Briefcase size={13} /> {j.company}
                    </div>
                    {j.deadline && (
                      <div className="uni-opportunity-card-deadline">
                        Deadline: {new Date(j.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
            {jobs.length === 0 && (
              <div style={{ color: "#6b7280", fontSize: 13, padding: 16 }}>
                Loading jobs...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Faculty Recommendation CTA */}
      <section className="uni-section">
        <div className="uni-container">
          <div className="uni-cta-banner">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div className="uni-feature-icon" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                <Users size={22} style={{ color: "#fff" }} />
              </div>
              <div>
                <h3>Find Your Faculty Path</h3>
                <p>Discover the right university faculty based on your high school combination. Get personalised recommendations to make confident academic decisions.</p>
              </div>
            </div>
            <Link to="/faculty-recommendation" className="uni-hero-btn-primary" style={{ flexShrink: 0, padding: "10px 24px", fontSize: 13 }}>
              Find Faculties <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Career Advice CTA */}
      <section className="uni-section">
        <div className="uni-container">
          <div className="uni-cta-banner">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div className="uni-feature-icon" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                <CalendarDays size={22} style={{ color: "#fff" }} />
              </div>
              <div>
                <h3>Need Career Guidance?</h3>
                <p>Schedule a one-on-one session with a counsellor and receive practical direction on courses, opportunities, and your next career steps.</p>
              </div>
            </div>
            <Link to="/career-advice" className="uni-hero-btn-primary" style={{ flexShrink: 0, padding: "10px 24px", fontSize: 13 }}>
              Book a Session <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Features */}
      <section className="uni-section-alt">
        <div className="uni-container">
          <div className="uni-section-heading">
            <h2>What Unigate Offers</h2>
          </div>
          <div className="uni-feature-grid">
            <Link to="/scholarships" className="uni-feature-card">
              <div className="uni-feature-icon" style={{ backgroundColor: "hsl(140, 40%, 94%)" }}>
                <GraduationCap size={20} style={{ color: "hsl(140, 45%, 32%)" }} />
              </div>
              <div>
                <div className="uni-feature-title">Scholarship Listings</div>
                <div className="uni-feature-desc">Browse and apply for scholarships from universities worldwide.</div>
              </div>
            </Link>
            <Link to="/jobs" className="uni-feature-card">
              <div className="uni-feature-icon" style={{ backgroundColor: "hsl(262, 50%, 95%)" }}>
                <Briefcase size={20} style={{ color: "hsl(262, 50%, 45%)" }} />
              </div>
              <div>
                <div className="uni-feature-title">Job Opportunities</div>
                <div className="uni-feature-desc">Find internships, entry-level positions, and professional roles.</div>
              </div>
            </Link>
            <Link to="/past-papers" className="uni-feature-card">
              <div className="uni-feature-icon" style={{ backgroundColor: "hsl(38, 80%, 94%)" }}>
                <FileText size={20} style={{ color: "hsl(38, 80%, 38%)" }} />
              </div>
              <div>
                <div className="uni-feature-title">Past Papers</div>
                <div className="uni-feature-desc">Access previous examination papers to prepare for your exams.</div>
              </div>
            </Link>
            <Link to="/career-advice" className="uni-feature-card">
              <div className="uni-feature-icon" style={{ backgroundColor: "hsl(216, 50%, 94%)" }}>
                <CalendarDays size={20} style={{ color: "hsl(216, 64%, 28%)" }} />
              </div>
              <div>
                <div className="uni-feature-title">Career Advice</div>
                <div className="uni-feature-desc">Book sessions with counsellors for personalised career guidance.</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;

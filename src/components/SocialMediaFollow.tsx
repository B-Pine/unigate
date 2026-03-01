const SOCIAL_LINKS = {
  youtube: "https://youtube.com/@YourChannel",
  twitter: "https://x.com/YourHandle",
  linkedin: "https://linkedin.com/company/YourCompany",
};

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function SocialMediaFollow({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
          style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF0000")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          aria-label="YouTube">
          <YouTubeIcon />
        </a>
        <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
          style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          aria-label="X (Twitter)">
          <TwitterIcon />
        </a>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
          style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0A66C2")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
      </div>
    );
  }

  return (
    <section style={{ backgroundColor: "#f9fafb", padding: "36px 0" }}>
      <div className="uni-container" style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
          Follow Us on Social Media
        </h3>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
          Stay connected for the latest scholarships, jobs, and career tips.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 8,
              backgroundColor: "#fff", border: "1px solid #e5e7eb",
              color: "#111827", fontSize: 13, fontWeight: 500,
              textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF0000"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(255,0,0,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span style={{ color: "#FF0000" }}><YouTubeIcon /></span> YouTube
          </a>
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 8,
              backgroundColor: "#fff", border: "1px solid #e5e7eb",
              color: "#111827", fontSize: 13, fontWeight: 500,
              textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span style={{ color: "#000" }}><TwitterIcon /></span> X (Twitter)
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 8,
              backgroundColor: "#fff", border: "1px solid #e5e7eb",
              color: "#111827", fontSize: 13, fontWeight: 500,
              textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0A66C2"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(10,102,194,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span style={{ color: "#0A66C2" }}><LinkedInIcon /></span> LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

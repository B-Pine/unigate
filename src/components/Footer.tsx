import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, FileText, MessageSquare, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { SocialMediaFollow } from "./SocialMediaFollow";

export function Footer() {
  return (
    <footer className="uni-footer">
      {/* Main footer */}
      <div className="uni-footer-main">
        <div className="uni-container">
          <div className="uni-footer-grid">
            {/* Brand column */}
            <div className="uni-footer-brand-col">
              <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <img src="/logo.png" alt="Unigate" style={{ height: 36, width: "auto" }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>UNIGATE</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Opportunity Portal</div>
                </div>
              </Link>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 280, marginBottom: 16 }}>
                Connecting students and graduates with scholarships, jobs, faculty pathways, and career guidance across Rwanda and beyond.
              </p>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Follow Us</div>
                <SocialMediaFollow compact />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="uni-footer-heading">Quick Links</h4>
              <ul className="uni-footer-links">
                <li><Link to="/scholarships"><GraduationCap size={14} /> Scholarships</Link></li>
                <li><Link to="/jobs"><Briefcase size={14} /> Job Opportunities</Link></li>
                <li><Link to="/past-papers"><FileText size={14} /> Past Papers</Link></li>
                <li><Link to="/career-advice"><MessageSquare size={14} /> Career Advice</Link></li>
                <li><Link to="/faculty-recommendation">Faculty Finder</Link></li>
                <li>
                  <a href="https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={14} /> Join WhatsApp Group
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="uni-footer-heading">Resources</h4>
              <ul className="uni-footer-links">
                <li><Link to="/auth">Student Portal</Link></li>
                <li><Link to="/auth">Create Account</Link></li>
                <li><Link to="/past-papers">Exam Papers</Link></li>
                <li><Link to="/career-advice">Book Counselling</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="uni-footer-heading">Contact Us</h4>
              <ul className="uni-footer-contact">
                <li><MapPin size={14} /> Kigali, Rwanda</li>
                <li><Phone size={14} /> +250 782 987 977</li>
                <li><Mail size={14} /> <a href="mailto:info@unigate.rw">info@unigate.rw</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="uni-footer-bottom">
        <div className="uni-container">
          <span>&copy; {new Date().getFullYear()} Unigate. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Privacy Policy</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

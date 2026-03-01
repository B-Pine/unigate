import { PublicLayout } from "@/components/PublicLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, GraduationCap, Heart } from "lucide-react";
import { useState } from "react";
import { useScholarships } from "@/hooks/use-scholarships";
import { useBookmarks, useToggleBookmark } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const placeholderImg = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80";

const Scholarships = () => {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const { data, isLoading } = useScholarships({
    search: search || undefined,
    country: country || undefined,
    page,
    limit: 12,
  });

  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const scholarships = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const isBookmarked = (id: number) =>
    bookmarks?.some((b) => b.item_type === "scholarship" && b.item_id === id) ?? false;

  const handleToggleBookmark = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark.mutate({ item_type: "scholarship", item_id: id });
  };

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <div className="uni-breadcrumb">
            <Link to="/">Home</Link> / Scholarships
          </div>
          <h1>Scholarships</h1>
          <p>Browse available scholarship opportunities from universities around the world.</p>
        </div>
      </div>

      <div className="uni-page-content">
        <div className="uni-container">
          {/* Filters */}
          <div className="uni-filters">
            <div className="relative flex-1" style={{ minWidth: 200 }}>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9ca3af" }} />
              <Input
                placeholder="Search by title or university..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 h-9 text-sm"
                style={{ borderColor: "#e5e7eb", borderRadius: 6 }}
              />
            </div>
            <Select value={country} onValueChange={(v) => { setCountry(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48 h-9 text-sm" style={{ borderColor: "#e5e7eb", borderRadius: 6 }}>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Rwanda">Rwanda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
              Loading scholarships...
            </div>
          )}

          {/* Empty */}
          {!isLoading && scholarships.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
              No scholarships found matching your criteria.
            </div>
          )}

          {/* Card Grid */}
          {scholarships.length > 0 && (
            <div className="uni-card-grid">
              {scholarships.map((s) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const deadlineDate = s.deadline ? new Date(s.deadline) : null;
                if (deadlineDate) deadlineDate.setHours(0, 0, 0, 0);
                const isExpired = deadlineDate && deadlineDate < now;
                const actualStatus = isExpired ? "Closed" : s.status;
                const bookmarked = isBookmarked(s.id);

                return (
                  <Link to={`/scholarships/${s.id}`} key={s.id} className="uni-opportunity-card">
                    <div className="uni-opportunity-card-image">
                      <img src={s.image_url || placeholderImg} alt={s.title} />
                      <span className={`uni-badge ${actualStatus === "Open" ? "uni-badge-open" : "uni-badge-closed"}`}>
                        {actualStatus}
                      </span>
                      {user && (
                        <button
                          className="uni-bookmark-btn"
                          onClick={(e) => handleToggleBookmark(e, s.id)}
                        >
                          <Heart
                            size={16}
                            fill={bookmarked ? "#ef4444" : "none"}
                            style={{ color: bookmarked ? "#ef4444" : "#6b7280" }}
                          />
                        </button>
                      )}
                    </div>
                    <div className="uni-opportunity-card-body">
                      <div className="uni-opportunity-card-title">{s.title}</div>
                      <div className="uni-opportunity-card-meta">
                        <GraduationCap size={13} />
                        {s.university}
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
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="uni-pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="uni-pagination-btn"
              >
                Previous
              </button>
              <span className="uni-pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="uni-pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Scholarships;

import { PublicLayout } from "@/components/PublicLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Building2, Heart } from "lucide-react";
import { useState } from "react";
import { useJobs } from "@/hooks/use-jobs";
import { useBookmarks, useToggleBookmark } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const placeholderImg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const { data, isLoading } = useJobs({
    search: search || undefined,
    experience_level: experience || undefined,
    page,
    limit: 12,
  });

  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const jobs = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const isBookmarked = (id: number) =>
    bookmarks?.some((b) => b.item_type === "job" && b.item_id === id) ?? false;

  const handleToggleBookmark = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark.mutate({ item_type: "job", item_id: id });
  };

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <div className="uni-breadcrumb">
            <Link to="/">Home</Link> / Job Opportunities
          </div>
          <h1>Job Opportunities</h1>
          <p>Find job openings, internships, and career opportunities that match your profile.</p>
        </div>
      </div>

      <div className="uni-page-content">
        <div className="uni-container">
          {/* Filters */}
          <div className="uni-filters">
            <div className="relative flex-1" style={{ minWidth: 200 }}>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9ca3af" }} />
              <Input
                placeholder="Search by title or company..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 h-9 text-sm"
                style={{ borderColor: "#e5e7eb", borderRadius: 6 }}
              />
            </div>
            <Select value={experience} onValueChange={(v) => { setExperience(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48 h-9 text-sm" style={{ borderColor: "#e5e7eb", borderRadius: 6 }}>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="1-2 Years">1-2 Years</SelectItem>
                <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
              Loading jobs...
            </div>
          )}

          {/* Empty */}
          {!isLoading && jobs.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
              No jobs found matching your criteria.
            </div>
          )}

          {/* Card Grid */}
          {jobs.length > 0 && (
            <div className="uni-card-grid">
              {jobs.map((j) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const deadlineDate = j.deadline ? new Date(j.deadline) : null;
                if (deadlineDate) deadlineDate.setHours(0, 0, 0, 0);
                const isExpired = deadlineDate && deadlineDate < now;
                const actualStatus = isExpired ? "Closed" : j.status;
                const bookmarked = isBookmarked(j.id);

                return (
                  <Link to={`/jobs/${j.id}`} key={j.id} className="uni-opportunity-card">
                    <div className="uni-opportunity-card-image">
                      <img src={j.image_url || placeholderImg} alt={j.title} />
                      <span className={`uni-badge ${actualStatus === "Open" ? "uni-badge-open" : "uni-badge-closed"}`}>
                        {actualStatus}
                      </span>
                      {user && (
                        <button
                          className="uni-bookmark-btn"
                          onClick={(e) => handleToggleBookmark(e, j.id)}
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
                      <div className="uni-opportunity-card-title">{j.title}</div>
                      <div className="uni-opportunity-card-meta">
                        <Building2 size={13} />
                        {j.company}
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

export default Jobs;

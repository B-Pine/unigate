import { PublicLayout } from "@/components/PublicLayout";
import { useBookmarks, useToggleBookmark } from "@/hooks/use-bookmarks";
import { Heart, GraduationCap, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Bookmark } from "@/types";

const Bookmarks = () => {
  const { data: bookmarks, isLoading } = useBookmarks();
  const toggleBookmark = useToggleBookmark();
  const [filter, setFilter] = useState<"all" | "scholarship" | "job">("all");

  const filtered = (bookmarks || []).filter((b) =>
    filter === "all" ? true : b.item_type === filter
  );

  const handleRemove = (b: Bookmark) => {
    toggleBookmark.mutate({ item_type: b.item_type, item_id: b.item_id });
  };

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <div className="uni-breadcrumb">
            <Link to="/">Home</Link> / My Bookmarks
          </div>
          <h1>My Bookmarks</h1>
          <p>Your saved scholarships and job opportunities.</p>
        </div>
      </div>

      <div className="uni-page-content">
        <div className="uni-container">
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {(["all", "scholarship", "job"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 16px",
                  fontSize: 13,
                  border: "1px solid",
                  borderColor: filter === f ? "hsl(216, 64%, 28%)" : "#e5e7eb",
                  borderRadius: 6,
                  backgroundColor: filter === f ? "hsl(216, 64%, 28%)" : "#fff",
                  color: filter === f ? "#fff" : "#374151",
                  cursor: "pointer",
                }}
              >
                {f === "all" ? "All" : f === "scholarship" ? "Scholarships" : "Jobs"}
              </button>
            ))}
          </div>

          {isLoading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
              Loading bookmarks...
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
              No bookmarks yet. Browse{" "}
              <Link to="/scholarships" style={{ color: "hsl(216, 64%, 38%)" }}>scholarships</Link> or{" "}
              <Link to="/jobs" style={{ color: "hsl(216, 64%, 38%)" }}>jobs</Link> and tap the heart icon to save them.
            </div>
          )}

          {filtered.length > 0 && (
            <div className="uni-list">
              {filtered.map((b) => {
                const item = b.item;
                const title = item ? ("title" in item ? item.title : "Untitled") : "Item no longer available";
                const subtitle = item
                  ? b.item_type === "scholarship"
                    ? (item as any).university
                    : (item as any).company
                  : "";
                const detailPath = b.item_type === "scholarship"
                  ? `/scholarships/${b.item_id}`
                  : `/jobs/${b.item_id}`;

                return (
                  <div key={b.id} className="uni-list-item">
                    <div className="flex items-center justify-between">
                      <Link to={detailPath} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit", flex: 1 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            backgroundColor: b.item_type === "scholarship" ? "hsl(216, 60%, 94%)" : "hsl(142, 40%, 94%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {b.item_type === "scholarship" ? (
                            <GraduationCap size={16} style={{ color: "hsl(216, 64%, 38%)" }} />
                          ) : (
                            <Building2 size={16} style={{ color: "hsl(142, 50%, 32%)" }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{title}</div>
                          {subtitle && (
                            <div style={{ fontSize: 12, color: "#6b7280" }}>{subtitle}</div>
                          )}
                        </div>
                      </Link>
                      <button
                        onClick={() => handleRemove(b)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 6,
                        }}
                        title="Remove bookmark"
                      >
                        <Heart size={18} fill="#ef4444" style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Bookmarks;

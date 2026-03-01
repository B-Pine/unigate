import { useState } from "react";
import { useScholarships } from "@/hooks/use-scholarships";
import { useBookmarks, useToggleBookmark } from "@/hooks/use-bookmarks";
import { Heart } from "lucide-react";

export default function StudentScholarships() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useScholarships({ search, country, page, limit: 10 });
  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const bookmarkedIds = new Set(
    bookmarks?.filter((b) => b.item_type === "scholarship").map((b) => b.item_id) || []
  );

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 20 }}>Scholarships</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search scholarships..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" }}
        />
        <input
          type="text"
          placeholder="Filter by country"
          value={country}
          onChange={(e) => { setCountry(e.target.value); setPage(1); }}
          style={{ width: 160, height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" }}
        />
      </div>

      {isLoading && <p style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Loading...</p>}

      {data?.data.map((s) => (
        <div key={s.id} className="list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="list-item-title">{s.title}</span>
              <span
                title={s.status}
                style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: s.status === "Open" ? "hsl(140,45%,38%)" : "hsl(0,55%,50%)",
                }}
              />
            </div>
            <div className="list-item-meta">
              {s.university} &middot; {s.country}
              {s.deadline && <> &middot; Deadline: {new Date(s.deadline).toLocaleDateString()}</>}
            </div>
            {s.description && <div className="list-item-desc" style={{ marginTop: 4 }}>{s.description}</div>}
          </div>
          <button
            onClick={() => toggleBookmark.mutate({ item_type: "scholarship", item_id: s.id })}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 4,
              color: bookmarkedIds.has(s.id) ? "hsl(0,55%,50%)" : "hsl(0,0%,70%)",
            }}
            title={bookmarkedIds.has(s.id) ? "Remove bookmark" : "Bookmark"}
          >
            <Heart size={16} fill={bookmarkedIds.has(s.id) ? "currentColor" : "none"} />
          </button>
        </div>
      ))}

      {data && data.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 20 }}>
          <button
            className="action-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>
            Page {data.page} of {data.totalPages}
          </span>
          <button
            className="action-btn"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

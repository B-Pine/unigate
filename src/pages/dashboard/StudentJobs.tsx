import { useState } from "react";
import { useJobs } from "@/hooks/use-jobs";
import { useBookmarks, useToggleBookmark } from "@/hooks/use-bookmarks";
import { Heart } from "lucide-react";

export default function StudentJobs() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useJobs({ search, experience_level: level, page, limit: 10 });
  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const bookmarkedIds = new Set(
    bookmarks?.filter((b) => b.item_type === "job").map((b) => b.item_id) || []
  );

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 20 }}>Jobs</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" }}
        />
        <select
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1); }}
          style={{ width: 160, height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" }}
        >
          <option value="">All Levels</option>
          <option value="entry">Entry</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      {isLoading && <p style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Loading...</p>}

      {data?.data.map((j) => (
        <div key={j.id} className="list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="list-item-title">{j.title}</span>
              <span
                title={j.status}
                style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: j.status === "Open" ? "hsl(140,45%,38%)" : "hsl(0,55%,50%)",
                }}
              />
            </div>
            <div className="list-item-meta">
              {j.company}
              {j.experience_level && <> &middot; {j.experience_level}</>}
              {j.deadline && <> &middot; Deadline: {new Date(j.deadline).toLocaleDateString()}</>}
            </div>
            {j.description && <div className="list-item-desc" style={{ marginTop: 4 }}>{j.description}</div>}
          </div>
          <button
            onClick={() => toggleBookmark.mutate({ item_type: "job", item_id: j.id })}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 4,
              color: bookmarkedIds.has(j.id) ? "hsl(0,55%,50%)" : "hsl(0,0%,70%)",
            }}
            title={bookmarkedIds.has(j.id) ? "Remove bookmark" : "Bookmark"}
          >
            <Heart size={16} fill={bookmarkedIds.has(j.id) ? "currentColor" : "none"} />
          </button>
        </div>
      ))}

      {data && data.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 20 }}>
          <button className="action-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Page {data.page} of {data.totalPages}</span>
          <button className="action-btn" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useBookmarks, useToggleBookmark } from "@/hooks/use-bookmarks";
import { X } from "lucide-react";

export default function StudentBookmarks() {
  const [tab, setTab] = useState<"scholarship" | "job">("scholarship");
  const { data: bookmarks, isLoading } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const filtered = bookmarks?.filter((b) => b.item_type === tab) || [];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 20 }}>Bookmarks</h2>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #e0e0e0" }}>
        {(["scholarship", "job"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 500,
              color: tab === t ? "hsl(216,64%,28%)" : "hsl(0,0%,50%)",
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2px solid hsl(216,64%,28%)" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            {t === "scholarship" ? "Scholarships" : "Jobs"}
          </button>
        ))}
      </div>

      {isLoading && <p style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Loading...</p>}

      {filtered.length === 0 && !isLoading && (
        <p style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>No bookmarked {tab === "scholarship" ? "scholarships" : "jobs"} yet.</p>
      )}

      {filtered.map((b) => (
        <div key={b.id} className="list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="list-item-title">
              {b.item_type === "scholarship"
                ? (b.item as any)?.title || "Scholarship"
                : (b.item as any)?.title || "Job"}
            </div>
            <div className="list-item-meta">
              {b.item_type === "scholarship"
                ? (b.item as any)?.university
                : (b.item as any)?.company}
            </div>
          </div>
          <button
            className="action-btn-danger"
            onClick={() => toggleBookmark.mutate({ item_type: b.item_type, item_id: b.item_id })}
          >
            <X size={12} style={{ marginRight: 4 }} />
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { usePastPapers } from "@/hooks/use-past-papers";
import { downloadWithAuth, getApiUrl } from "@/lib/api";
import { LEVELS } from "@/lib/past-paper-constants";
import { Download } from "lucide-react";

export default function StudentPastPapers() {
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePastPapers({
    subject,
    year: year ? Number(year) : undefined,
    level: level || undefined,
    page,
    limit: 20,
  });

  const handleAnswerDownload = async (paperId: number, filename: string) => {
    try {
      await downloadWithAuth(`/past-papers/${paperId}/download-answer`, filename);
    } catch {
      alert("Failed to download answer file.");
    }
  };

  const selectStyle = { height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 20 }}>Past Papers</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by subject..."
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 150, height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" }}
        />
        <select
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1); }}
          style={{ ...selectStyle, width: 130 }}
        >
          <option value="">All Levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => { setYear(e.target.value); setPage(1); }}
          style={{ width: 100, height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" }}
        />
      </div>

      {isLoading && <p style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Loading...</p>}

      {data?.data.map((p) => (
        <div key={p.id} className="list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="list-item-title">
              {p.subject}
              {p.category === "paid" && (
                <span
                  style={{
                    fontSize: 10,
                    color: "hsl(38, 80%, 38%)",
                    backgroundColor: "hsl(38, 80%, 94%)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    marginLeft: 8,
                    fontWeight: 600,
                  }}
                >
                  PREMIUM
                </span>
              )}
            </div>
            <div className="list-item-meta">{p.year} &middot; {p.level}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <a
              href={getApiUrl(`/past-papers/${p.id}/download`)}
              className="action-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}
            >
              <Download size={13} />
              Question
            </a>
            {p.category === "paid" && p.answer_file_path && (
              <button
                onClick={() => handleAnswerDownload(p.id, p.answer_original_filename || "answer.pdf")}
                className="action-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}
              >
                <Download size={13} />
                Answer
              </button>
            )}
          </div>
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

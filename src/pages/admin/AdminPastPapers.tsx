import { useState, useRef } from "react";
import { usePastPapers, useUploadPastPaper, useDeletePastPaper } from "@/hooks/use-past-papers";
import { DataTable } from "@/components/DataTable";
import { FormDialog } from "@/components/FormDialog";
import { LEVELS, SUBJECTS_BY_LEVEL } from "@/lib/past-paper-constants";
import type { PastPaper } from "@/types";

export default function AdminPastPapers() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePastPapers({ page, limit: 20 });
  const upload = useUploadPastPaper();
  const remove = useDeletePastPaper();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState<"free" | "paid">("free");
  const [level, setLevel] = useState("O-Level");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const answerFileRef = useRef<HTMLInputElement>(null);

  // Get subjects for the currently selected level
  const availableSubjects = SUBJECTS_BY_LEVEL[level] || [];

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    // Reset subject if it's not available in the new level
    const newSubjects = SUBJECTS_BY_LEVEL[newLevel] || [];
    if (!newSubjects.includes(subject)) {
      setSubject("");
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !subject || !year) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("year", year);
    formData.append("level", level);
    formData.append("category", category);

    // Append answer file if paid and provided
    const answerFile = answerFileRef.current?.files?.[0];
    if (category === "paid" && answerFile) {
      formData.append("answerFile", answerFile);
    }

    upload.mutate(formData, {
      onSuccess: () => {
        setDialogOpen(false);
        setCategory("free");
        setSubject("");
        setYear("");
        setLevel("O-Level");
        if (fileRef.current) fileRef.current.value = "";
        if (answerFileRef.current) answerFileRef.current.value = "";
      },
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this past paper?")) remove.mutate(id);
  };

  const inputStyle = { width: "100%", height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 500, color: "hsl(0,0%,40%)", marginBottom: 4 };

  const columns = [
    { key: "subject", header: "Subject" },
    { key: "year", header: "Year" },
    { key: "level", header: "Level" },
    {
      key: "category",
      header: "Category",
      render: (p: PastPaper) => (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 4,
            backgroundColor: p.category === "paid" ? "hsl(38, 80%, 94%)" : "hsl(142, 60%, 94%)",
            color: p.category === "paid" ? "hsl(38, 80%, 38%)" : "hsl(142, 60%, 30%)",
          }}
        >
          {p.category === "paid" ? "Paid" : "Free"}
        </span>
      ),
    },
    { key: "original_filename", header: "Question File" },
    {
      key: "answer_original_filename",
      header: "Answer File",
      render: (p: PastPaper) => (
        <span style={{ fontSize: 12, color: p.answer_original_filename ? "inherit" : "#9ca3af" }}>
          {p.answer_original_filename || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p: PastPaper) => (
        <button className="action-btn-danger" onClick={() => handleDelete(p.id)}>
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Past Papers</h2>
        <button
          onClick={() => setDialogOpen(true)}
          style={{
            height: 32,
            fontSize: 13,
            padding: "0 16px",
            backgroundColor: "hsl(216,64%,28%)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            cursor: "pointer",
          }}
        >
          Upload Paper
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Upload Past Paper">
        <form onSubmit={handleUpload}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as "free" | "paid")} style={inputStyle}>
                <option value="free">Free</option>
                <option value="paid">Paid (with answers)</option>
              </select>
            </div>

            {/* Level & Year */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Level *</label>
                <select value={level} onChange={(e) => handleLevelChange(e.target.value)} style={inputStyle}>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Year *</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required style={inputStyle} />
              </div>
            </div>

            {/* Subject (dynamic based on level) */}
            <div>
              <label style={labelStyle}>Subject *</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} required style={inputStyle}>
                <option value="">Select subject...</option>
                {availableSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Question PDF */}
            <div>
              <label style={labelStyle}>Question PDF *</label>
              <input ref={fileRef} type="file" accept=".pdf" required style={{ fontSize: 13 }} />
            </div>

            {/* Answer PDF - only shown when category is paid */}
            {category === "paid" && (
              <div>
                <label style={labelStyle}>Answer PDF</label>
                <input ref={answerFileRef} type="file" accept=".pdf" style={{ fontSize: 13 }} />
                <span style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, display: "block" }}>
                  Upload the answer sheet for premium users
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={upload.isPending}
              style={{
                height: 34,
                fontSize: 13,
                backgroundColor: "hsl(216,64%,28%)",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              {upload.isPending ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}

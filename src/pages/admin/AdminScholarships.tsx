import { useState } from "react";
import { useScholarships, useCreateScholarship, useUpdateScholarship, useDeleteScholarship } from "@/hooks/use-scholarships";
import { useUploadImage, useUploadAudio } from "@/hooks/use-upload";
import { Volume2, X, Plus, Pencil, Trash2 } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "link"];

const emptyForm = { title: "", university: "", country: "", description: "", requirements: "", deadline: "", form_link: "", status: "Open", image_url: "", audio_url: "", platform_link: "" };

export default function AdminScholarships() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useScholarships({
    page,
    limit: 15,
    search: search || undefined,
    status: statusFilter || undefined,
  });
  const create = useCreateScholarship();
  const update = useUpdateScholarship();
  const remove = useDeleteScholarship();
  const uploadImage = useUploadImage();
  const uploadAudio = useUploadAudio();

  const scholarships = data?.data || [];

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (row: any) => {
    setEditingId(row.id);
    setForm({
      title: row.title || "",
      university: row.university || "",
      country: row.country || "",
      description: row.description || "",
      requirements: row.requirements || "",
      deadline: row.deadline ? row.deadline.split("T")[0] : "",
      form_link: row.form_link || "",
      status: row.status || "Open",
      image_url: row.image_url || "",
      audio_url: row.audio_url || "",
      platform_link: row.platform_link || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.university.trim() || !form.country.trim()) {
      window.alert("Title, university, and country are required.");
      return;
    }

    const payload = {
      title: form.title,
      university: form.university,
      country: form.country,
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      deadline: form.deadline || "",
      form_link: form.form_link.trim(),
      status: form.status,
      image_url: form.image_url.trim(),
      audio_url: form.audio_url.trim(),
      platform_link: form.platform_link.trim(),
    };

    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, ...payload } as any);
      } else {
        await create.mutateAsync(payload as any);
      }
      closeModal();
    } catch {
      window.alert("Failed to save. Please check the form and try again.");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this scholarship?")) remove.mutate(id);
  };

  const handleImageUpload = async (file: File) => {
    const result = await uploadImage.mutateAsync(file);
    setForm((prev) => ({ ...prev, image_url: result.url }));
  };

  const handleAudioUpload = async (file: File) => {
    const result = await uploadAudio.mutateAsync(file);
    setForm((prev) => ({ ...prev, audio_url: result.url }));
  };

  const isSaving = create.isPending || update.isPending;

  const inputStyle: React.CSSProperties = { width: "100%", height: 36, fontSize: 13, border: "1px solid #d4d7dd", borderRadius: 6, padding: "0 10px", backgroundColor: "#fff" };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Scholarships</h2>
        <button className="action-btn" onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={14} /> Add New
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          placeholder="Filter by title/university/country"
          style={{ ...inputStyle, height: 32, maxWidth: 320, borderRadius: 0 }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
          style={{ ...inputStyle, height: 32, width: 140, borderRadius: 0 }}
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden", backgroundColor: "#fff" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 900, tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Title</th>
                <th>University</th>
                <th>Country</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Image</th>
                <th>Audio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j}>
                        <div style={{ height: 14, backgroundColor: "hsl(220,14%,93%)", borderRadius: 2, width: "75%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : scholarships.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "hsl(0,0%,50%)", padding: 20 }}>
                    No scholarships found
                  </td>
                </tr>
              ) : (
                scholarships.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div style={{ fontSize: 12, padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                        {row.title}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {row.university}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, padding: "0 4px" }}>{row.country}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, padding: "0 4px", color: "#6b7280" }}>
                        {row.deadline ? new Date(row.deadline).toLocaleDateString() : "—"}
                      </div>
                    </td>
                    <td>
                      <div style={{ padding: "0 4px" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                          ...(row.status === "Open"
                            ? { backgroundColor: "hsl(140, 40%, 94%)", color: "hsl(140, 45%, 25%)" }
                            : { backgroundColor: "hsl(0, 0%, 95%)", color: "hsl(0, 0%, 45%)" }),
                        }}>
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ padding: "0 4px" }}>
                        {row.image_url ? (
                          <img src={row.image_url} alt="" style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 2 }} />
                        ) : (
                          <span style={{ fontSize: 12, color: "hsl(0,0%,60%)" }}>—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ padding: "0 4px" }}>
                        {row.audio_url ? <Volume2 size={16} color="hsl(216,64%,28%)" /> : <span style={{ fontSize: 12, color: "hsl(0,0%,60%)" }}>—</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4, padding: "0 4px" }}>
                        <button className="action-btn" onClick={() => openEdit(row)} style={{ fontSize: 11, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                          <Pencil size={12} /> Edit
                        </button>
                        <button className="action-btn-danger" onClick={() => handleDelete(row.id)} style={{ fontSize: 11, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data?.page && data?.totalPages && data.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
          <button className="action-btn" disabled={data.page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Page {data.page} of {data.totalPages}</span>
          <button className="action-btn" disabled={data.page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {/* Full-screen Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            width: "90vw",
            maxWidth: 860,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: "1px solid #e5e7eb",
              flexShrink: 0,
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
                {editingId ? "Edit Scholarship" : "Add New Scholarship"}
              </h3>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#6b7280", borderRadius: 6 }}>
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>University *</label>
                  <input value={form.university} onChange={(e) => setForm((prev) => ({ ...prev, university: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Country *</label>
                  <input value={form.country} onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Deadline</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Application Link</label>
                  <input value={form.form_link} onChange={(e) => setForm((prev) => ({ ...prev, form_link: e.target.value }))} placeholder="https://..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Platform Link</label>
                  <input value={form.platform_link} onChange={(e) => setForm((prev) => ({ ...prev, platform_link: e.target.value }))} placeholder="https://..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} style={inputStyle}>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Image</label>
                    <label style={{
                      ...inputStyle,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: form.image_url ? "hsl(140, 45%, 30%)" : "#6b7280",
                      backgroundColor: form.image_url ? "hsl(140, 40%, 96%)" : "#fff",
                      fontSize: 12,
                    }}>
                      {uploadImage.isPending ? "Uploading..." : form.image_url ? "Image Uploaded" : "Choose Image"}
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                    </label>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Audio</label>
                    <label style={{
                      ...inputStyle,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: form.audio_url ? "hsl(140, 45%, 30%)" : "#6b7280",
                      backgroundColor: form.audio_url ? "hsl(140, 40%, 96%)" : "#fff",
                      fontSize: 12,
                    }}>
                      {uploadAudio.isPending ? "Uploading..." : form.audio_url ? "Audio Uploaded" : "Choose Audio"}
                      <input type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAudioUpload(f); }} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Rich text editors */}
              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Description</label>
                <div style={{ border: "1px solid #d4d7dd", borderRadius: 6, overflow: "hidden" }}>
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Requirements</label>
                <div style={{ border: "1px solid #d4d7dd", borderRadius: 6, overflow: "hidden" }}>
                  <ReactQuill
                    theme="snow"
                    value={form.requirements}
                    onChange={(val) => setForm((prev) => ({ ...prev, requirements: val }))}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>

              {/* Image preview */}
              {form.image_url && (
                <div style={{ marginTop: 16 }}>
                  <label style={labelStyle}>Image Preview</label>
                  <img src={form.image_url} alt="Preview" style={{ maxWidth: 200, maxHeight: 120, objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb" }} />
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              padding: "16px 24px",
              borderTop: "1px solid #e5e7eb",
              flexShrink: 0,
            }}>
              <button onClick={closeModal} style={{ fontSize: 13, padding: "8px 20px", background: "none", border: "1px solid #d4d7dd", borderRadius: 6, cursor: "pointer", color: "#6b7280" }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  fontSize: 13,
                  padding: "8px 24px",
                  backgroundColor: "hsl(216, 64%, 28%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                {isSaving ? "Saving..." : editingId ? "Update Scholarship" : "Create Scholarship"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

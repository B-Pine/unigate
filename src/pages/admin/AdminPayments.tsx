import { useState } from "react";
import { usePayments, useUpdatePayment } from "@/hooks/use-payments";

const API_BASE = "/api";

export default function AdminPayments() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionRow, setActionRow] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [viewImage, setViewImage] = useState<string | null>(null);

  const { data, isLoading } = usePayments({
    page,
    limit: 20,
    status: statusFilter || undefined,
  });
  const updatePayment = useUpdatePayment();

  const payments = data?.data || [];

  const handleAction = async (id: number, status: "approved" | "rejected") => {
    try {
      await updatePayment.mutateAsync({ id, status, admin_notes: adminNotes || undefined });
      setActionRow(null);
      setAdminNotes("");
    } catch {
      window.alert("Failed to update payment status.");
    }
  };

  const inputStyle = { width: "100%", height: 30, fontSize: 12, border: "1px solid #d4d7dd", borderRadius: 0, padding: "0 8px", backgroundColor: "#fff" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Payments</h2>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <select
          value={statusFilter}
          onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
          style={{ ...inputStyle, height: 32, width: 160 }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div style={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden", backgroundColor: "#fff" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 800, tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Screenshot</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Admin Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j}>
                        <div style={{ height: 14, backgroundColor: "hsl(220,14%,93%)", borderRadius: 2, width: "75%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "hsl(0,0%,50%)", padding: 20 }}>
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontSize: 12, padding: "0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.user_name || "—"}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, padding: "0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.user_email || "—"}
                      </div>
                    </td>
                    <td>
                      {p.screenshot_url ? (
                        <button
                          onClick={() => setViewImage(p.screenshot_url!)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "0 8px",
                            fontSize: 12,
                            color: "hsl(216, 64%, 38%)",
                            textDecoration: "underline",
                          }}
                        >
                          View
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "#9ca3af", padding: "0 8px" }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ padding: "0 8px" }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 4,
                          ...(p.status === "approved" ? {
                            backgroundColor: "hsl(140, 40%, 94%)",
                            color: "hsl(140, 45%, 25%)",
                          } : p.status === "pending" ? {
                            backgroundColor: "hsl(38, 80%, 94%)",
                            color: "hsl(38, 60%, 30%)",
                          } : {
                            backgroundColor: "hsl(0, 60%, 95%)",
                            color: "hsl(0, 50%, 35%)",
                          }),
                        }}>
                          {p.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, padding: "0 8px", color: "#6b7280" }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, padding: "0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#6b7280" }}>
                        {p.admin_notes || "—"}
                      </div>
                    </td>
                    <td>
                      {actionRow === p.id ? (
                        <div style={{ padding: "4px 8px" }}>
                          <textarea
                            placeholder="Admin notes (optional)"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            style={{ width: "100%", height: 48, fontSize: 11, border: "1px solid #d4d7dd", padding: "4px 6px", resize: "none", marginBottom: 4 }}
                          />
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              className="action-btn"
                              onClick={() => handleAction(p.id, "approved")}
                              disabled={updatePayment.isPending}
                              style={{ fontSize: 11, padding: "3px 10px", backgroundColor: "hsl(140, 40%, 40%)", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer" }}
                            >
                              Approve
                            </button>
                            <button
                              className="action-btn-danger"
                              onClick={() => handleAction(p.id, "rejected")}
                              disabled={updatePayment.isPending}
                              style={{ fontSize: 11, padding: "3px 10px" }}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => { setActionRow(null); setAdminNotes(""); }}
                              style={{ fontSize: 11, padding: "3px 8px", background: "none", border: "1px solid #d4d7dd", borderRadius: 3, cursor: "pointer", color: "#6b7280" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: "0 8px", display: "flex", gap: 4 }}>
                          {p.status === "pending" ? (
                            <button
                              className="action-btn"
                              onClick={() => { setActionRow(p.id); setAdminNotes(""); }}
                              style={{ fontSize: 11, padding: "3px 12px" }}
                            >
                              Review
                            </button>
                          ) : (
                            <button
                              onClick={() => { setActionRow(p.id); setAdminNotes(p.admin_notes || ""); }}
                              style={{ fontSize: 11, padding: "3px 10px", background: "none", border: "1px solid #d4d7dd", borderRadius: 3, cursor: "pointer", color: "#6b7280" }}
                            >
                              Change
                            </button>
                          )}
                        </div>
                      )}
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

      {/* Image Viewer Modal */}
      {viewImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
          onClick={() => setViewImage(null)}
        >
          <div style={{ maxWidth: "90vw", maxHeight: "90vh", position: "relative" }}>
            <img
              src={viewImage}
              alt="Payment screenshot"
              style={{ maxWidth: "100%", maxHeight: "85vh", borderRadius: 8, boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}
            />
            <button
              onClick={() => setViewImage(null)}
              style={{
                position: "absolute",
                top: -12,
                right: -12,
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 700,
                color: "#374151",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

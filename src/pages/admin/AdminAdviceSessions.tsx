import { useAllAdviceSessions, useUpdateAdviceSession, useDeleteAdviceSession } from "@/hooks/use-advice-sessions";
import { DataTable } from "@/components/DataTable";
import type { AdviceSession } from "@/types";
import { Trash2 } from "lucide-react";

export default function AdminAdviceSessions() {
  const { data: sessions, isLoading } = useAllAdviceSessions();
  const update = useUpdateAdviceSession();
  const remove = useDeleteAdviceSession();

  const handleStatusChange = (session: AdviceSession, newStatus: string) => {
    update.mutate({ id: session.id, status: newStatus });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this advice session?")) {
      remove.mutate(id);
    }
  };

  const statusClass = (s: string) => {
    switch (s) {
      case "Pending": return "badge-status badge-pending";
      case "Approved": return "badge-status badge-approved";
      case "Completed": return "badge-status badge-completed";
      case "Rejected": return "badge-status badge-cancelled";
      default: return "badge-status";
    }
  };

  const selectStyle = {
    height: 28,
    fontSize: 12,
    border: "1px solid #e0e0e0",
    borderRadius: 4,
    padding: "0 6px",
    backgroundColor: "#fff",
    cursor: "pointer",
  };

  const columns = [
    { key: "user_name", header: "Student" },
    { key: "user_email", header: "Email" },
    { key: "time", header: "Day / Time", render: (s: AdviceSession) => `${s.day_of_week} ${s.start_time}-${s.end_time}` },
    { key: "reason", header: "Reason", render: (s: AdviceSession) => (
      <span style={{ maxWidth: 200, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {s.reason}
      </span>
    )},
    { key: "status", header: "Status", render: (s: AdviceSession) => (
      <select
        value={s.status}
        onChange={(e) => handleStatusChange(s, e.target.value)}
        style={selectStyle}
        className={statusClass(s.status)}
      >
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Completed">Completed</option>
        <option value="Rejected">Rejected</option>
      </select>
    )},
    { key: "actions", header: "", render: (s: AdviceSession) => (
      <button
        onClick={() => handleDelete(s.id)}
        title="Delete session"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          borderRadius: 4,
          color: "hsl(0, 60%, 50%)",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Trash2 size={15} />
      </button>
    )},
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 20 }}>Advice Sessions</h2>
      <DataTable columns={columns} data={sessions || []} loading={isLoading} />
    </div>
  );
}

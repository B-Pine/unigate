import { useState } from "react";
import { useTimeSlots, useCreateTimeSlot, useUpdateTimeSlot, useDeleteTimeSlot } from "@/hooks/use-time-slots";
import { DataTable } from "@/components/DataTable";
import { FormDialog } from "@/components/FormDialog";
import type { TimeSlot } from "@/types";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const emptyForm = { day_of_week: "Monday", start_time: "09:00", end_time: "10:00", is_active: true };

export default function AdminTimeSlots() {
  const { data: slots, isLoading } = useTimeSlots();
  const create = useCreateTimeSlot();
  const update = useUpdateTimeSlot();
  const remove = useDeleteTimeSlot();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TimeSlot | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (s: TimeSlot) => {
    setEditing(s);
    setForm({ day_of_week: s.day_of_week, start_time: s.start_time, end_time: s.end_time, is_active: s.is_active });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      update.mutate({ id: editing.id, ...form } as any, { onSuccess: () => setDialogOpen(false) });
    } else {
      create.mutate(form as any, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this time slot?")) remove.mutate(id);
  };

  const inputStyle = { width: "100%", height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 500, color: "hsl(0,0%,40%)", marginBottom: 4 };

  const columns = [
    { key: "day_of_week", header: "Day" },
    { key: "start_time", header: "Start" },
    { key: "end_time", header: "End" },
    { key: "is_active", header: "Active", render: (s: TimeSlot) => s.is_active ? "Yes" : "No" },
    { key: "actions", header: "Actions", render: (s: TimeSlot) => (
      <div style={{ display: "flex", gap: 6 }}>
        <button className="action-btn" onClick={() => openEdit(s)}>Edit</button>
        <button className="action-btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
      </div>
    )},
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Time Slots</h2>
        <button onClick={openCreate} style={{
          height: 32, fontSize: 13, padding: "0 16px", backgroundColor: "hsl(216,64%,28%)",
          color: "#fff", border: "none", borderRadius: 2, cursor: "pointer",
        }}>
          Add Time Slot
        </button>
      </div>

      <DataTable columns={columns} data={slots || []} loading={isLoading} />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Time Slot" : "Add Time Slot"}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={labelStyle}>Day *</label>
              <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} style={inputStyle}>
                {days.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Start Time *</label>
                <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>End Time *</label>
                <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Active
              </label>
            </div>
            <button type="submit" disabled={create.isPending || update.isPending} style={{
              height: 34, fontSize: 13, backgroundColor: "hsl(216,64%,28%)", color: "#fff",
              border: "none", borderRadius: 2, cursor: "pointer", marginTop: 4,
            }}>
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}

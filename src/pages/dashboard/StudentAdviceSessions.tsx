import { useState } from "react";
import { useTimeSlots } from "@/hooks/use-time-slots";
import { useMyAdviceSessions, useBookAdviceSession } from "@/hooks/use-advice-sessions";

export default function StudentAdviceSessions() {
  const { data: slots } = useTimeSlots();
  const { data: sessions, isLoading } = useMyAdviceSessions();
  const bookSession = useBookAdviceSession();

  const [slotId, setSlotId] = useState("");
  const [reason, setReason] = useState("");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotId || !reason.trim()) return;
    bookSession.mutate(
      { time_slot_id: Number(slotId), reason },
      {
        onSuccess: () => {
          setSlotId("");
          setReason("");
        },
      }
    );
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "pending": return "badge-status badge-pending";
      case "approved": return "badge-status badge-approved";
      case "completed": return "badge-status badge-completed";
      case "cancelled": return "badge-status badge-cancelled";
      default: return "badge-status";
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 20 }}>Advice Sessions</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Book a Session */}
        <div className="form-section">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 16 }}>Book a Session</h3>
          <form onSubmit={handleBook}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "hsl(0,0%,40%)", marginBottom: 4 }}>
                Time Slot
              </label>
              <select
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                required
                style={{ width: "100%", height: 34, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: "0 10px" }}
              >
                <option value="">Select a time slot</option>
                {slots?.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.day_of_week} {slot.start_time} - {slot.end_time}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "hsl(0,0%,40%)", marginBottom: 4 }}>
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Briefly describe why you need advice..."
                style={{ width: "100%", minHeight: 80, fontSize: 13, border: "1px solid #e0e0e0", borderRadius: 2, padding: 10, resize: "vertical" }}
              />
            </div>
            <button
              type="submit"
              disabled={bookSession.isPending}
              style={{
                height: 32, fontSize: 13, padding: "0 16px",
                backgroundColor: "hsl(216,64%,28%)", color: "#fff",
                border: "none", borderRadius: 2, cursor: "pointer",
              }}
            >
              {bookSession.isPending ? "Booking..." : "Book Session"}
            </button>
            {bookSession.isError && (
              <p style={{ fontSize: 12, color: "hsl(0,55%,50%)", marginTop: 8 }}>
                {(bookSession.error as any)?.message || "Failed to book session"}
              </p>
            )}
          </form>
        </div>

        {/* Available Slots */}
        <div className="form-section">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 16 }}>Available Slots</h3>
          {slots?.map((slot) => (
            <div key={slot.id} style={{ padding: "6px 0", fontSize: 13, borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ fontWeight: 500 }}>{slot.day_of_week}</span>{" "}
              <span style={{ color: "hsl(0,0%,50%)" }}>{slot.start_time} - {slot.end_time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* My Sessions */}
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "hsl(0,0%,20%)", marginBottom: 12 }}>My Sessions</h3>
      {isLoading && <p style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Loading...</p>}

      {sessions?.length === 0 && (
        <p style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>No sessions booked yet.</p>
      )}

      {sessions?.map((s) => (
        <div key={s.id} className="list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="list-item-title">
              {s.day_of_week} {s.start_time} - {s.end_time}
            </div>
            <div className="list-item-meta">{s.reason}</div>
            {s.admin_notes && (
              <div style={{ fontSize: 12, color: "hsl(216,64%,28%)", marginTop: 4 }}>
                Note: {s.admin_notes}
              </div>
            )}
          </div>
          <span className={statusClass(s.status)}>{s.status}</span>
        </div>
      ))}
    </div>
  );
}

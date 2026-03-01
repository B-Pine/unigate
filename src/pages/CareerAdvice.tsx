import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTimeSlots } from "@/hooks/use-time-slots";
import { useAuth } from "@/contexts/AuthContext";
import { useBookAdviceSession, useMyAdviceSessions } from "@/hooks/use-advice-sessions";
import { Link } from "react-router-dom";
import { Clock, CheckCircle } from "lucide-react";

const CareerAdvice = () => {
  const [slotId, setSlotId] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: timeSlots, isLoading: loadingSlots } = useTimeSlots();
  const bookSession = useBookAdviceSession();
  const { data: mySessions } = useMyAdviceSessions();

  const activeSlots = (timeSlots || []).filter((s) => s.is_active);

  const formatSlot = (s: { day_of_week: string; start_time: string; end_time: string }) =>
    `${s.day_of_week} ${s.start_time} - ${s.end_time}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotId || !reason) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    try {
      await bookSession.mutateAsync({ time_slot_id: Number(slotId), reason });
      setSubmitted(true);
      setSlotId("");
      setReason("");
      toast({ title: "Request submitted successfully" });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message || "Could not submit request", variant: "destructive" });
    }
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="uni-page-header">
          <div className="uni-container">
            <h1>Kugisha Inama</h1>
          </div>
        </div>
        <div className="uni-page-content">
          <div className="uni-container">
            <div className="uni-card" style={{ maxWidth: 500 }}>
              <div className="uni-card-body" style={{ textAlign: "center", padding: "40px 32px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "hsl(140, 40%, 94%)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <CheckCircle size={24} style={{ color: "hsl(140, 45%, 32%)" }} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                  Request Submitted
                </h2>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
                  Your career advice session request has been submitted. You will receive a confirmation once approved.
                </p>
                <button onClick={() => setSubmitted(false)} className="uni-btn-primary">
                  Submit Another Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <div className="uni-breadcrumb">
            <Link to="/">Home</Link> / Career Advice
          </div>
          <h1>Kugisha Inama</h1>
          <p>Saba kugirwa inama kubijyanye nicyo wakwiga muri University</p>
        </div>
      </div>

      <div className="uni-page-content">
        <div className="uni-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Available time slots */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Clock size={18} style={{ color: "hsl(216, 64%, 28%)" }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Available Time Slots</span>
              </div>
              {loadingSlots && (
                <div style={{ color: "#6b7280", fontSize: 13, padding: "16px 0" }}>Loading time slots...</div>
              )}
              {activeSlots.length > 0 ? (
                <div className="uni-list">
                  {activeSlots.map((s) => (
                    <div key={s.id} className="uni-list-item">
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "hsl(140, 45%, 45%)", flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{formatSlot(s)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !loadingSlots ? (
                <div style={{ color: "#6b7280", fontSize: 13 }}>No time slots available at the moment.</div>
              ) : null}
            </div>

            {/* Right: Request form or sign-in prompt */}
            {user ? (
              <div className="uni-card">
                <div className="uni-card-body">
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                    Request a Session
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4b5563", marginBottom: 6 }}>
                        Preferred Time Slot
                      </label>
                      <Select value={slotId} onValueChange={setSlotId}>
                        <SelectTrigger className="h-9 text-sm" style={{ borderColor: "#e5e7eb", borderRadius: 6 }}>
                          <SelectValue placeholder="Select a time slot..." />
                        </SelectTrigger>
                        <SelectContent>
                          {activeSlots.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>{formatSlot(s)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4b5563", marginBottom: 6 }}>
                        Reason for Request
                      </label>
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Briefly describe what you'd like to discuss..."
                        rows={3}
                        className="text-sm"
                        style={{ borderColor: "#e5e7eb", borderRadius: 6 }}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-9 px-5"
                      style={{ borderRadius: 6 }}
                      disabled={bookSession.isPending}
                    >
                      {bookSession.isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="uni-card">
                <div className="uni-card-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", textAlign: "center" }}>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                    Request a Session
                  </h2>
                  <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                    Sign in to your account to book a career advice session.
                  </p>
                  <Link to="/auth" className="uni-btn-primary">Sign In</Link>
                </div>
              </div>
            )}
          </div>

          {/* Booked sessions */}
          {user && mySessions && mySessions.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                Your Sessions
              </div>
              <div className="uni-list">
                {mySessions.map((session) => (
                  <div key={session.id} className="uni-list-item">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>
                        {session.day_of_week} {session.start_time} - {session.end_time}
                      </span>
                      <span
                        className={`uni-badge ${
                          session.status === "pending"
                            ? "uni-badge-pending"
                            : session.status === "approved"
                              ? "uni-badge-approved"
                              : session.status === "completed"
                                ? "uni-badge-completed"
                                : "uni-badge-cancelled"
                        }`}
                      >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CareerAdvice;

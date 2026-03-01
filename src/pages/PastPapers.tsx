import { PublicLayout } from "@/components/PublicLayout";
import { FolderCard } from "@/components/FolderCard";
import { Download, FileText, ChevronRight, LogIn, X, Upload, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState, useRef } from "react";
import { usePastPapers } from "@/hooks/use-past-papers";
import { useMyPaymentStatus, useSubmitPayment } from "@/hooks/use-payments";
import { useAuth } from "@/contexts/AuthContext";
import { downloadWithAuth } from "@/lib/api";
import { Link } from "react-router-dom";
import { LEVELS, SUBJECTS_BY_LEVEL } from "@/lib/past-paper-constants";

type Depth = 0 | 1 | 2 | 3;

const PastPapers = () => {
  const { user } = useAuth();

  // Navigation state
  const [category, setCategory] = useState<"free" | "paid" | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const depth: Depth = subject ? 3 : level ? 2 : category ? 1 : 0;

  // Only fetch papers when at depth 3
  const { data, isLoading } = usePastPapers({
    category: category || undefined,
    level: level || undefined,
    subject: subject || undefined,
    page,
    limit: 20,
    enabled: depth === 3,
  });

  // Payment status (only fetch when user is logged in)
  const { data: paymentData, isLoading: paymentLoading } = useMyPaymentStatus(!!user);
  const submitPayment = useSubmitPayment();

  const paymentStatus = paymentData && "status" in paymentData ? paymentData.status : "none";
  const paymentNotes = paymentData && "admin_notes" in paymentData ? (paymentData as any).admin_notes : null;
  const hasApprovedPayment = paymentStatus === "approved";

  const papers = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // Breadcrumb segments
  const breadcrumbs: { label: string; onClick: () => void }[] = [
    {
      label: "Past Papers",
      onClick: () => { setCategory(null); setLevel(null); setSubject(null); setPage(1); },
    },
  ];
  if (category) {
    breadcrumbs.push({
      label: category === "free" ? "Free Papers" : "Premium Papers",
      onClick: () => { setLevel(null); setSubject(null); setPage(1); },
    });
  }
  if (level) {
    breadcrumbs.push({
      label: level,
      onClick: () => { setSubject(null); setPage(1); },
    });
  }
  if (subject) {
    breadcrumbs.push({ label: subject, onClick: () => {} });
  }

  const handlePaidDownload = async (paperId: number, filename: string, isAnswer = false) => {
    if (!user) {
      setShowPaymentModal(true);
      return;
    }
    if (!hasApprovedPayment) {
      setShowPaymentModal(true);
      return;
    }
    try {
      const endpoint = isAnswer
        ? `/api/past-papers/${paperId}/download-answer`
        : `/api/past-papers/${paperId}/download`;
      await downloadWithAuth(endpoint, filename);
    } catch {
      alert("Failed to download file.");
    }
  };

  const handleAnswerDownload = async (paperId: number, filename: string) => {
    try {
      await downloadWithAuth(`/api/past-papers/${paperId}/download-answer`, filename);
    } catch {
      alert("Failed to download answer file.");
    }
  };

  const handlePaymentSubmit = async () => {
    if (!selectedFile) return;
    try {
      await submitPayment.mutateAsync(selectedFile);
      setSelectedFile(null);
      setShowPaymentModal(false);
    } catch (err: any) {
      alert(err?.message || "Failed to submit payment proof. Please try again.");
    }
  };

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <div className="uni-breadcrumb">
            <Link to="/">Home</Link> / Past Papers
          </div>
          <h1>Past Examination Papers</h1>
          <p>Browse past examination papers organised by category, level and subject.</p>
        </div>
      </div>

      <div className="uni-page-content">
        <div className="uni-container">
          {/* Payment status banner for paid section */}
          {category === "paid" && user && !paymentLoading && paymentStatus !== "none" && (
            <div style={{
              marginBottom: 20,
              padding: "14px 20px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 13,
              ...(paymentStatus === "approved" ? {
                backgroundColor: "hsl(140, 40%, 94%)",
                border: "1px solid hsl(140, 40%, 80%)",
                color: "hsl(140, 45%, 25%)",
              } : paymentStatus === "pending" ? {
                backgroundColor: "hsl(38, 80%, 94%)",
                border: "1px solid hsl(38, 80%, 80%)",
                color: "hsl(38, 60%, 30%)",
              } : {
                backgroundColor: "hsl(0, 60%, 95%)",
                border: "1px solid hsl(0, 50%, 80%)",
                color: "hsl(0, 50%, 35%)",
              }),
            }}>
              {paymentStatus === "approved" && <><CheckCircle size={18} /> Your payment has been approved. You can download all premium papers.</>}
              {paymentStatus === "pending" && <><Clock size={18} /> Your payment is under review. You'll be able to download once approved.</>}
              {paymentStatus === "rejected" && (
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <XCircle size={18} />
                    <span>Your payment was rejected.</span>
                  </div>
                  {paymentNotes && <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>Reason: {paymentNotes}</div>}
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    style={{
                      marginTop: 8,
                      padding: "6px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: "hsl(216, 64%, 38%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Resubmit Payment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Breadcrumb Navigation */}
          {depth > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
              {breadcrumbs.map((b, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {i > 0 && <ChevronRight size={14} style={{ color: "#9ca3af" }} />}
                  {i < breadcrumbs.length - 1 ? (
                    <button
                      onClick={b.onClick}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        fontSize: 14,
                        color: "hsl(216, 64%, 38%)",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                      }}
                    >
                      {b.label}
                    </button>
                  ) : (
                    <span style={{ fontSize: 14, color: "hsl(0, 0%, 30%)", fontWeight: 600 }}>
                      {b.label}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Depth 0: Category selection */}
          {depth === 0 && (
            <div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
                Choose a collection to browse:
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <FolderCard
                  label="Free Papers"
                  onClick={() => { setCategory("free"); setPage(1); }}
                />
                <FolderCard
                  label="Premium Papers"
                  locked
                  onClick={() => { setCategory("paid"); setPage(1); }}
                />
              </div>
            </div>
          )}

          {/* Depth 1: Level selection */}
          {depth === 1 && (
            <div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
                Select education level:
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {LEVELS.map((l) => (
                  <FolderCard
                    key={l}
                    label={l}
                    locked={category === "paid"}
                    onClick={() => { setLevel(l); setPage(1); }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Depth 2: Subject selection */}
          {depth === 2 && level && (
            <div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
                Select subject:
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {(SUBJECTS_BY_LEVEL[level] || []).map((s) => (
                  <FolderCard
                    key={s}
                    label={s}
                    locked={category === "paid"}
                    onClick={() => { setSubject(s); setPage(1); }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Depth 3: Paper list */}
          {depth === 3 && (
            <div>
              {/* Loading */}
              {isLoading && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
                  Loading papers...
                </div>
              )}

              {/* Empty */}
              {!isLoading && papers.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 13 }}>
                  No papers found in this category yet.
                </div>
              )}

              {/* List */}
              {papers.length > 0 && (
                <div className="uni-list">
                  {papers.map((p) => (
                    <div key={p.id} className="uni-list-item">
                      <div className="flex items-center justify-between">
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FileText
                              size={28}
                              strokeWidth={1.3}
                              style={{ color: category === "paid" ? "hsl(38, 80%, 45%)" : "hsl(216, 64%, 45%)" }}
                            />
                          </div>
                          <div>
                            <span className="uni-list-title">{p.subject}</span>
                            <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>
                              {p.year}
                            </span>
                            {p.level && (
                              <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>
                                ({p.level})
                              </span>
                            )}
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
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {/* Question PDF download */}
                          {p.category === "free" ? (
                            <a
                              href={`/api/past-papers/${p.id}/download`}
                              className="uni-btn-outline"
                              style={{ fontSize: 12, padding: "5px 14px", gap: 4 }}
                            >
                              <Download size={13} />
                              Question
                            </a>
                          ) : (
                            <button
                              onClick={() => handlePaidDownload(p.id, p.original_filename)}
                              className="uni-btn-outline"
                              style={{ fontSize: 12, padding: "5px 14px", gap: 4, cursor: "pointer" }}
                            >
                              <Download size={13} />
                              Question
                            </button>
                          )}

                          {/* Answer PDF - only for paid papers */}
                          {p.category === "paid" && p.answer_file_path && (
                            user && hasApprovedPayment ? (
                              <button
                                onClick={() =>
                                  handleAnswerDownload(p.id, p.answer_original_filename || "answer.pdf")
                                }
                                className="uni-btn-outline"
                                style={{
                                  fontSize: 12,
                                  padding: "5px 14px",
                                  gap: 4,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <Download size={13} />
                                Answer
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (!user) {
                                    window.location.href = "/auth";
                                  } else {
                                    setShowPaymentModal(true);
                                  }
                                }}
                                className="uni-btn-outline"
                                style={{
                                  fontSize: 12,
                                  padding: "5px 14px",
                                  gap: 4,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  color: "hsl(38, 80%, 38%)",
                                  borderColor: "hsl(38, 80%, 60%)",
                                  cursor: "pointer",
                                }}
                              >
                                {!user ? <LogIn size={13} /> : <Download size={13} />}
                                {!user ? "Login for Answers" : "Answer"}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="uni-pagination">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="uni-pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="uni-pagination-info">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="uni-pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
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
          onClick={(e) => { if (e.target === e.currentTarget) setShowPaymentModal(false); }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              width: "100%",
              maxWidth: 480,
              maxHeight: "90vh",
              overflow: "auto",
              padding: "28px 24px",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              <X size={20} />
            </button>

            {!user ? (
              // Not logged in
              <div style={{ textAlign: "center" }}>
                <LogIn size={40} style={{ color: "hsl(216, 64%, 38%)", marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                  Login Required
                </h3>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                  You need to create an account and log in to access premium papers.
                </p>
                <Link
                  to="/auth"
                  style={{
                    display: "inline-block",
                    padding: "10px 28px",
                    backgroundColor: "hsl(216, 64%, 38%)",
                    color: "#fff",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Go to Login
                </Link>
              </div>
            ) : paymentStatus === "pending" ? (
              // Payment pending
              <div style={{ textAlign: "center" }}>
                <Clock size={40} style={{ color: "hsl(38, 60%, 45%)", marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                  Payment Under Review
                </h3>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
                  Your payment proof has been submitted and is being reviewed by our admin team.
                </p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>
                  You'll be able to download premium papers once your payment is approved. This usually takes a few hours.
                </p>
              </div>
            ) : (
              // No payment or rejected — show MoMo codes + upload form
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  Access Premium Papers
                </h3>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                  Make a payment via MoMo and upload the proof to get access to all premium papers.
                </p>

                {paymentStatus === "rejected" && (
                  <div style={{
                    padding: "12px 16px",
                    backgroundColor: "hsl(0, 60%, 95%)",
                    border: "1px solid hsl(0, 50%, 80%)",
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 13,
                    color: "hsl(0, 50%, 35%)",
                  }}>
                    <strong>Previous payment was rejected.</strong>
                    {paymentNotes && <div style={{ marginTop: 4, fontSize: 12 }}>Reason: {paymentNotes}</div>}
                    <div style={{ marginTop: 4, fontSize: 12 }}>Please resubmit with a clear payment screenshot.</div>
                  </div>
                )}

                {/* MoMo payment details */}
                <div style={{
                  padding: "16px 20px",
                  backgroundColor: "hsl(48, 100%, 96%)",
                  border: "1px solid hsl(48, 80%, 80%)",
                  borderRadius: 8,
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
                    Payment Instructions
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                    <div>1. Send payment via <strong>MTN MoMo</strong> to:</div>
                    <div style={{
                      backgroundColor: "#fff",
                      padding: "10px 14px",
                      borderRadius: 6,
                      margin: "8px 0 12px",
                      border: "1px solid hsl(48, 60%, 85%)",
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "hsl(38, 80%, 38%)", letterSpacing: 0.5 }}>
                        +250782987977
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                        AHISHAKIYE Paccy
                      </div>
                    </div>
                    <div>2. Take a <strong>screenshot</strong> of the payment confirmation</div>
                    <div>3. Upload it below and wait for admin approval</div>
                  </div>
                </div>

                {/* Upload form */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                    Upload Payment Screenshot
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }}
                  />

                  {!selectedFile ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: "100%",
                        padding: "24px 16px",
                        border: "2px dashed hsl(216, 20%, 80%)",
                        borderRadius: 8,
                        backgroundColor: "hsl(216, 20%, 98%)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        color: "#6b7280",
                        fontSize: 13,
                      }}
                    >
                      <Upload size={24} style={{ color: "hsl(216, 64%, 45%)" }} />
                      <span>Click to select screenshot</span>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>JPEG, PNG or WebP (max 5MB)</span>
                    </button>
                  ) : (
                    <div style={{
                      padding: "12px 16px",
                      backgroundColor: "hsl(216, 20%, 98%)",
                      border: "1px solid hsl(216, 20%, 85%)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <div style={{ fontSize: 13, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedFile.name}
                      </div>
                      <button
                        onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4 }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!selectedFile || submitPayment.isPending}
                    style={{
                      width: "100%",
                      marginTop: 12,
                      padding: "11px 16px",
                      backgroundColor: !selectedFile || submitPayment.isPending ? "hsl(216, 20%, 85%)" : "hsl(216, 64%, 38%)",
                      color: !selectedFile || submitPayment.isPending ? "#9ca3af" : "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: !selectedFile || submitPayment.isPending ? "default" : "pointer",
                    }}
                  >
                    {submitPayment.isPending ? "Submitting..." : "Submit Payment Proof"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default PastPapers;

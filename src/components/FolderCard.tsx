import { Folder, FolderLock } from "lucide-react";

interface FolderCardProps {
  label: string;
  locked?: boolean;
  onClick: () => void;
}

export function FolderCard({ label, locked = false, onClick }: FolderCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "20px 16px",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        backgroundColor: "#fff",
        cursor: "pointer",
        transition: "all 0.15s ease",
        minWidth: 120,
        flex: "0 0 auto",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "hsl(216, 64%, 28%)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {locked ? (
        <FolderLock size={40} style={{ color: "hsl(38, 80%, 45%)" }} strokeWidth={1.5} />
      ) : (
        <Folder size={40} style={{ color: "hsl(216, 64%, 45%)" }} strokeWidth={1.5} />
      )}
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "hsl(0, 0%, 25%)",
          textAlign: "center",
          lineHeight: 1.3,
          wordBreak: "break-word",
          maxWidth: 110,
        }}
      >
        {label}
      </span>
    </button>
  );
}

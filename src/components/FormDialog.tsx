import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

export function FormDialog({ open, onOpenChange, title, children }: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: 500, padding: 20, borderRadius: 2 }}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: 16, fontWeight: 600, color: "hsl(0,0%,20%)" }}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div style={{ marginTop: 16 }}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

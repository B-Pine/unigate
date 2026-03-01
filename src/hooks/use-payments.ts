import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Payment, PaginatedResponse } from "@/types";

// User: check own payment status
export function useMyPaymentStatus(enabled = true) {
  return useQuery<Payment | { status: "none" }>({
    queryKey: ["my-payment-status"],
    queryFn: () => api("/payments/my-status"),
    enabled,
  });
}

// User: submit payment proof (screenshot)
export function useSubmitPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("screenshot", file);
      return api<Payment>("/payments", { method: "POST", body: formData, isFormData: true });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-payment-status"] });
    },
  });
}

// Admin: list all payments
interface PaymentFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export function usePayments(filters: PaymentFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();

  return useQuery<PaginatedResponse<Payment>>({
    queryKey: ["payments", filters],
    queryFn: () => api(`/payments${qs ? `?${qs}` : ""}`),
  });
}

// Admin: approve or reject a payment
export function useUpdatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, admin_notes }: { id: number; status: "approved" | "rejected"; admin_notes?: string }) =>
      api<Payment>(`/payments/${id}`, { method: "PUT", body: { status, admin_notes } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["my-payment-status"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdviceSession } from "@/types";

export function useMyAdviceSessions() {
  return useQuery<AdviceSession[]>({
    queryKey: ["my-advice-sessions"],
    queryFn: () => api("/advice-sessions"),
  });
}

export function useAdviceSessionCount() {
  return useQuery<{ count: number }>({
    queryKey: ["advice-session-count"],
    queryFn: () => api("/advice-sessions/count"),
  });
}

export function useAllAdviceSessions() {
  return useQuery<AdviceSession[]>({
    queryKey: ["all-advice-sessions"],
    queryFn: () => api("/advice-sessions/all"),
  });
}

export function useBookAdviceSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { time_slot_id: number; reason: string }) =>
      api("/advice-sessions", { method: "POST", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-advice-sessions"] }),
  });
}

export function useUpdateAdviceSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; status?: string; admin_notes?: string }) =>
      api(`/advice-sessions/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-advice-sessions"] });
      qc.invalidateQueries({ queryKey: ["my-advice-sessions"] });
    },
  });
}

export function useDeleteAdviceSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api(`/advice-sessions/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-advice-sessions"] });
      qc.invalidateQueries({ queryKey: ["my-advice-sessions"] });
    },
  });
}

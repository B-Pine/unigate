import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TimeSlot } from "@/types";

export function useTimeSlots() {
  return useQuery<TimeSlot[]>({
    queryKey: ["time-slots"],
    queryFn: () => api("/time-slots"),
  });
}

export function useCreateTimeSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TimeSlot>) =>
      api("/time-slots", { method: "POST", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["time-slots"] }),
  });
}

export function useUpdateTimeSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<TimeSlot> & { id: number }) =>
      api(`/time-slots/${id}`, { method: "PUT", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["time-slots"] }),
  });
}

export function useDeleteTimeSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api(`/time-slots/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["time-slots"] }),
  });
}

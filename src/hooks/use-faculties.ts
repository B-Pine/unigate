import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Faculty } from "@/types";

export function useFaculties() {
  return useQuery<Faculty[]>({
    queryKey: ["faculties"],
    queryFn: () => api("/faculties"),
  });
}

export function useCreateFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api("/faculties", { method: "POST", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faculties"] }),
  });
}

export function useUpdateFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; name: string; description?: string }) =>
      api(`/faculties/${id}`, { method: "PUT", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faculties"] }),
  });
}

export function useDeleteFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api(`/faculties/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faculties"] });
      qc.invalidateQueries({ queryKey: ["combinations"] });
      qc.invalidateQueries({ queryKey: ["linked-faculties"] });
    },
  });
}

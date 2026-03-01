import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Combination, Faculty } from "@/types";

export function useCombinations() {
  return useQuery<(Combination & { faculty_count: number })[]>({
    queryKey: ["combinations"],
    queryFn: () => api("/combinations"),
  });
}

export function useFacultiesByCombination(code: string) {
  return useQuery<{ combination: Combination; faculties: Faculty[] }>({
    queryKey: ["faculties", code],
    queryFn: () => api(`/combinations/${code}/faculties`),
    enabled: !!code,
  });
}

export function useCreateCombination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { code: string; name: string }) =>
      api("/combinations", { method: "POST", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["combinations"] }),
  });
}

export function useUpdateCombination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; code: string; name: string }) =>
      api(`/combinations/${id}`, { method: "PUT", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["combinations"] }),
  });
}

export function useDeleteCombination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api(`/combinations/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["combinations"] }),
  });
}

export function useLinkedFaculties(combinationId: number | null) {
  return useQuery<Faculty[]>({
    queryKey: ["linked-faculties", combinationId],
    queryFn: () => api(`/combinations/${combinationId}/linked-faculties`),
    enabled: !!combinationId,
  });
}

export function useLinkFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ combinationId, facultyId }: { combinationId: number; facultyId: number }) =>
      api(`/combinations/${combinationId}/link-faculty`, { method: "POST", body: { faculty_id: facultyId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["linked-faculties"] });
      qc.invalidateQueries({ queryKey: ["combinations"] });
    },
  });
}

export function useUnlinkFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ combinationId, facultyId }: { combinationId: number; facultyId: number }) =>
      api(`/combinations/${combinationId}/unlink-faculty/${facultyId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["linked-faculties"] });
      qc.invalidateQueries({ queryKey: ["combinations"] });
    },
  });
}

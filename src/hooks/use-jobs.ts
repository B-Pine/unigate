import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Job, PaginatedResponse } from "@/types";

interface JobFilters {
  search?: string;
  experience_level?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useJobs(filters: JobFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.experience_level) params.set("experience_level", filters.experience_level);
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();

  return useQuery<PaginatedResponse<Job>>({
    queryKey: ["jobs", filters],
    queryFn: () => api(`/jobs${qs ? `?${qs}` : ""}`),
  });
}

export function useJob(id: number) {
  return useQuery<Job>({
    queryKey: ["job", id],
    queryFn: () => api(`/jobs/${id}`),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Job>) => api("/jobs", { method: "POST", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Job> & { id: number }) =>
      api(`/jobs/${id}`, { method: "PUT", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api(`/jobs/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

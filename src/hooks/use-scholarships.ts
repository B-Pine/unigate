import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Scholarship, PaginatedResponse } from "@/types";

interface ScholarshipFilters {
  search?: string;
  country?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useScholarships(filters: ScholarshipFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.country) params.set("country", filters.country);
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();

  return useQuery<PaginatedResponse<Scholarship>>({
    queryKey: ["scholarships", filters],
    queryFn: () => api(`/scholarships${qs ? `?${qs}` : ""}`),
  });
}

export function useScholarship(id: number) {
  return useQuery<Scholarship>({
    queryKey: ["scholarship", id],
    queryFn: () => api(`/scholarships/${id}`),
    enabled: !!id,
  });
}

export function useCreateScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Scholarship>) => api("/scholarships", { method: "POST", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scholarships"] }),
  });
}

export function useUpdateScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Scholarship> & { id: number }) =>
      api(`/scholarships/${id}`, { method: "PUT", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scholarships"] }),
  });
}

export function useDeleteScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api(`/scholarships/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scholarships"] }),
  });
}

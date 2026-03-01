import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PastPaper, PaginatedResponse } from "@/types";

interface PastPaperFilters {
  subject?: string;
  year?: number;
  level?: string;
  category?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function usePastPapers(filters: PastPaperFilters = {}) {
  const { enabled = true, ...rest } = filters;
  const params = new URLSearchParams();
  if (rest.subject) params.set("subject", rest.subject);
  if (rest.year) params.set("year", String(rest.year));
  if (rest.level) params.set("level", rest.level);
  if (rest.category) params.set("category", rest.category);
  if (rest.page) params.set("page", String(rest.page));
  if (rest.limit) params.set("limit", String(rest.limit));
  const qs = params.toString();

  return useQuery<PaginatedResponse<PastPaper>>({
    queryKey: ["past-papers", rest],
    queryFn: () => api(`/past-papers${qs ? `?${qs}` : ""}`),
    enabled,
  });
}

export function useUploadPastPaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api("/past-papers", { method: "POST", body: formData, isFormData: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["past-papers"] }),
  });
}

export function useDeletePastPaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api(`/past-papers/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["past-papers"] }),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Bookmark } from "@/types";

export function useBookmarks() {
  const token = typeof window !== "undefined" ? localStorage.getItem("unigate_token") : null;
  return useQuery<Bookmark[]>({
    queryKey: ["bookmarks"],
    queryFn: () => api("/bookmarks"),
    enabled: !!token,
  });
}

export function useToggleBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { item_type: "scholarship" | "job"; item_id: number }) =>
      api("/bookmarks", { method: "POST", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookmarks"] }),
  });
}

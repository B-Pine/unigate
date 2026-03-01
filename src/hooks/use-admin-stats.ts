import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminStats } from "@/types";

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => api("/admin/stats"),
  });
}

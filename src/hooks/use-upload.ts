import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api<{ url: string }>("/uploads/image", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
    },
  });
}

export function useUploadAudio() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api<{ url: string }>("/uploads/audio", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
    },
  });
}

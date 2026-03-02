const BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, isFormData = false } = options;

  const token = localStorage.getItem("unigate_token");
  const reqHeaders: Record<string, string> = { ...headers };

  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    reqHeaders["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method,
    headers: reqHeaders,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(data.message || "Request failed", response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getApiUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

export async function downloadWithAuth(url: string, filename: string) {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url.startsWith("/api") ? url.replace("/api", "") : url}`;
  const token = localStorage.getItem("unigate_token");
  const res = await fetch(fullUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export { ApiError };

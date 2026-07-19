// Capa HTTP genérica. Configura la URL del backend en .env => VITE_API_URL
// Local:      VITE_API_URL=http://localhost:3000/api
// Producción: VITE_API_URL=http://phoenix-backend-dev.eba-6mqfmmxf.us-east-1.elasticbeanstalk.com/api
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(path: string, method: Method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    let details: any = undefined;
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
      details = data.details;
    } catch {
      /* ignore */
    }
    const err = new Error(msg);
    if (details) (err as any).details = details;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: unknown) => request<T>(path, "POST", body),
  put: <T>(path: string, body?: unknown) => request<T>(path, "PUT", body),
  patch: <T>(path: string, body?: unknown) => request<T>(path, "PATCH", body),
  delete: <T>(path: string) => request<T>(path, "DELETE"),
};

export { BASE_URL as API_BASE_URL };

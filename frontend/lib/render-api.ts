// Lazy-validate at runtime (not module load) so Vercel builds succeed
// even before env vars are configured in the project dashboard.
// Includes a 60s AbortController timeout to handle Render free-tier cold starts.
export function renderFetch(path: string, init?: RequestInit): Promise<Response> {
  const BASE_URL = process.env.RENDER_API_URL;
  const API_KEY = process.env.RENDER_API_SECRET;

  if (!BASE_URL) throw new Error("RENDER_API_URL is not set");
  if (!API_KEY) throw new Error("RENDER_API_SECRET is not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  return fetch(`${BASE_URL}${path}`, {
    ...init,
    signal: controller.signal,
    headers: {
      "x-api-key": API_KEY,
      ...(init?.headers ?? {}),
    },
  }).finally(() => clearTimeout(timeout));
}

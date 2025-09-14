// PATH: front/lib/api.ts
// Helper fetch centralisé (TypeScript) qui ajoute le Bearer token si présent.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiGet<T = any>(path: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers || {});
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('userToken');
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

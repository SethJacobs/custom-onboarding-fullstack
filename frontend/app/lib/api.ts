// Use same-origin (empty string) unless an explicit backend URL is provided
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export type User = {
  id: number;
  email: string;
  aboutMe?: string;
  street?: string; city?: string; state?: string; zip?: string;
  birthdate?: string; // ISO
  currentStep: number;
  createdAt: string; updatedAt: string;
}

export type Config = {
  id?: number;
  page2ComponentA?: 'ABOUT_ME'|'ADDRESS'|'BIRTHDATE';
  page2ComponentB?: 'ABOUT_ME'|'ADDRESS'|'BIRTHDATE';
  page3ComponentA?: 'ABOUT_ME'|'ADDRESS'|'BIRTHDATE';
  page3ComponentB?: 'ABOUT_ME'|'ADDRESS'|'BIRTHDATE';
}

export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (!raw) return '';
  return raw.trim().replace(/\/+$/, '');
}

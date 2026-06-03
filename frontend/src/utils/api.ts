import { useAuthStore } from '@/store/useAuthStore';

const cleanUrl = (url: string | undefined, defaultPath: string, fallback: string): string => {
  const resolved = url || fallback;
  if (!resolved) return '';
  const clean = resolved.replace(/\/+$/, '');
  if (!clean.endsWith('/api/v1') && defaultPath) {
    return `${clean}${defaultPath}`;
  }
  return clean;
};

const BASE_URL = cleanUrl(
  import.meta.env.VITE_API_URL,
  '/api/v1',
  'https://faceshield-edgeai-backend.onrender.com'
);

async function request(url: string, method: string, data?: any, config?: any) {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config?.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    ...config,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error ${response.status}`);
  }

  const resData = await response.json();
  return { data: resData };
}

export const api = {
  get: (url: string, config?: any) => request(url, 'GET', undefined, config),
  post: (url: string, data?: any, config?: any) => request(url, 'POST', data, config),
  patch: (url: string, data?: any, config?: any) => request(url, 'PATCH', data, config),
  delete: (url: string, config?: any) => request(url, 'DELETE', undefined, config),
};
 
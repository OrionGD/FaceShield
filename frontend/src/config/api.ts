/**
 * Centralized API configuration.
 *
 * In development the Vite dev server talks to local services.
 * In production (Vercel build) the env vars point to Render URLs.
 *
 * Vite exposes env vars that start with VITE_ via import.meta.env.
 */

const cleanUrl = (url: string | undefined, defaultPath: string, fallback: string): string => {
  const resolved = url || fallback;
  if (!resolved) return '';
  const clean = resolved.replace(/\/+$/, '');
  if (!clean.endsWith('/api/v1') && defaultPath) {
    return `${clean}${defaultPath}`;
  }
  return clean;
};

/** NestJS EdgeAI backend (port 3456 locally) */
export const API_BASE = cleanUrl(
  import.meta.env.VITE_API_URL,
  '/api/v1',
  'https://faceshield-edgeai-backend.onrender.com'
);

/** Python FastAPI biometrics engine (port 8000 locally) */
export const BIOMETRICS_BASE = cleanUrl(
  import.meta.env.VITE_BIOMETRICS_URL,
  '/api/v1',
  'https://faceshield-biometrics.onrender.com'
);

/** WebSocket / real-time connection URL (same as NestJS backend, no path) */
export const SOCKET_URL = cleanUrl(
  import.meta.env.VITE_SOCKET_URL,
  '',
  'https://faceshield-edgeai-backend.onrender.com'
);

/** Terminal telemetry logger (dev-only, silently fails in production) */
export const TELEMETRY_URL = import.meta.env.VITE_TELEMETRY_URL || '';


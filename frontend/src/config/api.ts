/**
 * Centralized API configuration.
 *
 * In development the Vite dev server talks to local services.
 * In production (Vercel build) the env vars point to Render URLs.
 *
 * Vite exposes env vars that start with VITE_ via import.meta.env.
 */

/** NestJS EdgeAI backend (port 3456 locally) */
export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3456/api/v1';

/** Python FastAPI biometrics engine (port 8000 locally) */
export const BIOMETRICS_BASE =
  import.meta.env.VITE_BIOMETRICS_URL || 'http://localhost:8000/api/v1';

/** WebSocket / real-time connection URL (same as NestJS backend, no path) */
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:3456';

/** Terminal telemetry logger (dev-only, silently fails in production) */
export const TELEMETRY_URL =
  import.meta.env.VITE_TELEMETRY_URL || 'http://localhost:5566';

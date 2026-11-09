/**
 * Application environment configuration
 * 
 * Single source of truth for the API endpoint:
 * Change `NEXT_PUBLIC_API_URL` in `.env.local` to switch endpoints (localhost, Cloudflare tunnel, production).
 */
const DEFAULT_API_URL = 'http://localhost:4000/api';

export const ENV = {
  API_URL: (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, ''),
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'EDL Legal & Contract Management',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  IS_DEV: process.env.NODE_ENV !== 'production',
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

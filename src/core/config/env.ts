/**
 * Application environment configuration
 */
export const ENV = {
  API_URL:
    typeof window !== 'undefined'
      ? '/api'
      : process.env.NEXT_PUBLIC_API_URL || 'https://likely-ecology-refused-letters.trycloudflare.com/api',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'EDL Legal & Contract Management',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  IS_DEV: process.env.NODE_ENV !== 'production',
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

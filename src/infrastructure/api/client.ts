import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from '@core/config/env';
import { normalizeError } from '@core/errors';
import { TokenStorage } from '../storage/token-storage';

// Queue for concurrent requests waiting for token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Creates and configures the Axios HTTP Client
 */
function createHttpClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: ENV.API_URL,
    timeout: ENV.REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request Interceptor: Attach Auth Token
  instance.interceptors.request.use(
    (config) => {
      const token = TokenStorage.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(normalizeError(error))
  );

  // Response Interceptor: Format errors, unpack data, and auto-refresh rotated tokens
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      // If error response data is a Blob (e.g. from responseType: 'blob'), parse it as JSON
      if (
        typeof window !== 'undefined' &&
        error?.response?.data instanceof Blob
      ) {
        try {
          const text = await error.response.data.text();
          error.response.data = JSON.parse(text);
        } catch {
          // If not valid JSON, leave as is
        }
      }

      const normalized = normalizeError(error);

      // Handle 403 PATH_DIVISION_MISMATCH (Path Tampering or Outdated Permissions)
      if (
        normalized.statusCode === 403 &&
        (normalized.code === 'PATH_DIVISION_MISMATCH' ||
          (error?.response?.data as any)?.code === 'PATH_DIVISION_MISMATCH') &&
        typeof window !== 'undefined'
      ) {
        const originalRequest = error.config;
        // Attempt seamless refresh once in case permissions were newly assigned in database
        if (originalRequest && !originalRequest._retryPermissions) {
          originalRequest._retryPermissions = true;
          const refreshToken = TokenStorage.getRefreshToken();
          if (refreshToken) {
            try {
              const refreshRes = await axios.post(`${ENV.API_URL}/auth/refresh`, {
                refreshToken,
              });
              const data = refreshRes.data;
              const accessToken = data?.accessToken || data?.data?.accessToken;
              const newRefreshToken = data?.refreshToken || data?.data?.refreshToken;
              const user = data?.user || data?.data?.user;

              if (accessToken) {
                TokenStorage.setAccessToken(accessToken);
                if (newRefreshToken) TokenStorage.setRefreshToken(newRefreshToken);
                if (user) TokenStorage.setUser(user);

                window.dispatchEvent(
                  new CustomEvent('auth:token-refreshed', {
                    detail: { accessToken, refreshToken: newRefreshToken, user },
                  })
                );

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return instance(originalRequest);
              }
            } catch {
              // If refresh fails, fall through to alert and redirect
            }
          }
        }

        if (!window.location.pathname.includes('/dashboard')) {
          alert('ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໂມດູນນີ້ (Unauthorized module access)');
          window.location.href = '/dashboard';
        }
      }

      // Handle 401 Unauthorized - Check if it's TOKEN_OUTDATED or expired, and auto-refresh seamlessly!
      const reqUrl = error.config?.url || '';
      const isAuthEndpoint =
        reqUrl.includes('/auth/login') ||
        reqUrl.includes('/auth/hrm-login') ||
        reqUrl.includes('/auth/refresh');
      const isHrmLookup = reqUrl.includes('/users/hrm/');
      const isHrmError =
        typeof normalized.message === 'string' &&
        normalized.message.toLowerCase().includes('hrm');

      const originalRequest = error.config;

      // If the refresh request itself failed with 401, refresh token is invalid/revoked -> force logout
      if (reqUrl.includes('/auth/refresh')) {
        TokenStorage.clearSession();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:session-cleared'));
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
        }
        return Promise.reject(normalized);
      }

      if (
        normalized.statusCode === 401 &&
        typeof window !== 'undefined' &&
        !isAuthEndpoint &&
        !isHrmLookup &&
        !isHrmError &&
        originalRequest
      ) {
        // Prevent infinite loops if request was already retried once
        if (originalRequest._retry) {
          TokenStorage.clearSession();
          window.dispatchEvent(new CustomEvent('auth:session-cleared'));
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
          return Promise.reject(normalized);
        }

        const refreshToken = TokenStorage.getRefreshToken();
        if (!refreshToken) {
          TokenStorage.clearSession();
          window.dispatchEvent(new CustomEvent('auth:session-cleared'));
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
          return Promise.reject(normalized);
        }

        // If a refresh is already in progress by another concurrent request, queue this one
        if (isRefreshing) {
          return new Promise<AxiosResponse>((resolve, reject) => {
            failedQueue.push({
              resolve: (newToken: string) => {
                originalRequest._retry = true;
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(instance(originalRequest));
              },
              reject: (err: any) => {
                reject(err);
              },
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call refresh endpoint directly using raw axios to avoid interceptor circular call
          const refreshRes = await axios.post(`${ENV.API_URL}/auth/refresh`, {
            refreshToken,
          });

          const data = refreshRes.data;
          const accessToken = data?.accessToken || data?.data?.accessToken;
          const newRefreshToken = data?.refreshToken || data?.data?.refreshToken;
          const user = data?.user || data?.data?.user;

          if (accessToken) {
            TokenStorage.setAccessToken(accessToken);
            if (newRefreshToken) {
              TokenStorage.setRefreshToken(newRefreshToken);
            }
            if (user) {
              TokenStorage.setUser(user);
            }

            // Sync Zustand AuthStore via event
            window.dispatchEvent(
              new CustomEvent('auth:token-refreshed', {
                detail: { accessToken, refreshToken: newRefreshToken, user },
              })
            );

            // Resolve all queued requests with the fresh token
            processQueue(null, accessToken);

            instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // Retry the original request
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return instance(originalRequest);
          } else {
            throw new Error('Refresh response missing accessToken');
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          TokenStorage.clearSession();
          window.dispatchEvent(new CustomEvent('auth:session-cleared'));
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
          return Promise.reject(normalizeError(refreshErr));
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(normalized);
    }
  );

  return instance;
}

export const httpClient = createHttpClient();

/**
 * Typed API Client helper methods
 */
export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await httpClient.get<T>(url, config);
    return res.data;
  },

  async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const res = await httpClient.post<T>(url, data, config);
    return res.data;
  },

  async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const res = await httpClient.patch<T>(url, data, config);
    return res.data;
  },

  async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const res = await httpClient.put<T>(url, data, config);
    return res.data;
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await httpClient.delete<T>(url, config);
    return res.data;
  },
};

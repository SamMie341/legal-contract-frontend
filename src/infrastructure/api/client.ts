import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from '@core/config/env';
import { normalizeError } from '@core/errors';
import { TokenStorage } from '../storage/token-storage';

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

  // Response Interceptor: Format errors and unpack data
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

      // Handle 401 Unauthorized - auto clean up session ONLY when it's our session that expired
      // Do not clear session if the 401 is from external HRM lookup or an auth login endpoint
      const reqUrl = error.config?.url || '';
      const isAuthEndpoint = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/hrm-login');
      const isHrmLookup = reqUrl.includes('/users/hrm/');
      const isHrmError =
        typeof normalized.message === 'string' &&
        normalized.message.toLowerCase().includes('hrm');

      if (
        normalized.statusCode === 401 &&
        typeof window !== 'undefined' &&
        !isAuthEndpoint &&
        !isHrmLookup &&
        !isHrmError
      ) {
        TokenStorage.clearSession();
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
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

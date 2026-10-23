import { create } from 'zustand';
import {
  User,
  UserRole,
  UserPermissions,
  LoginCredentials,
  AuthResponse,
} from '@core/entities';
import { ApiResponse } from '@core/api';
import { getErrorMessage } from '@core/errors';
import { apiClient } from '@infrastructure/api/client';
import { TokenStorage } from '@infrastructure/storage/token-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials, isHrm?: boolean) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;

  // Role and Permission Checkers
  hasRole: (...roles: UserRole[]) => boolean;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  isAdmin: () => boolean;
  canView: () => boolean;
  canUpload: () => boolean;
  canEdit: () => boolean;
  canDelete: () => boolean;
  canDownload: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  /**
   * Login action - supports both HRM SSO and Local System Login
   */
  login: async (credentials: LoginCredentials, isHrm: boolean = false) => {
    set({ isLoading: true, error: null });

    try {
      const endpoint = isHrm ? '/auth/hrm-login' : '/auth/login';
      const response = await apiClient.post<AuthResponse>(endpoint, credentials);

      const { accessToken, user } = response;

      // Persist in localStorage and Cookie
      TokenStorage.setAccessToken(accessToken);
      TokenStorage.setUser(user);

      set({
        token: accessToken,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      set({
        error: message,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }
  },

  /**
   * Logout action - clears storage and resets store state
   */
  logout: () => {
    TokenStorage.clearSession();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * Fetch current profile from /auth/me to refresh state & permissions
   */
  fetchProfile: async () => {
    const token = get().token || TokenStorage.getAccessToken();
    if (!token) return;

    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      const user = response.data;
      TokenStorage.setUser(user);
      set({ user, isAuthenticated: true });
    } catch (err) {
      // If fetching profile fails (e.g., token expired), logout
      get().logout();
    }
  },

  /**
   * Initialize state from client storage on app boot
   */
  initialize: async () => {
    if (get().isInitialized) return;

    const token = TokenStorage.getAccessToken();
    const user = TokenStorage.getUser();

    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
        isInitialized: true,
      });

      // Optionally refresh user profile in background
      try {
        const response = await apiClient.get<ApiResponse<User>>('/auth/me');
        if (response.data) {
          TokenStorage.setUser(response.data);
          set({ user: response.data });
        }
      } catch {
        // Token might be invalid, logout
        get().logout();
      }
    } else {
      set({ isInitialized: true, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),

  /**
   * Check if current user has any of the specified roles
   */
  hasRole: (...roles: UserRole[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },

  /**
   * Check if current user has a specific granular permission
   * ADMIN has all permissions by default
   */
  hasPermission: (permission: keyof UserPermissions) => {
    const { user } = get();
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;
    return Boolean(user[permission]);
  },

  /**
   * Convenience helpers
   */
  isAdmin: () => {
    const { user } = get();
    return user?.role === UserRole.ADMIN;
  },

  canView: () => get().hasPermission('canView'),
  canUpload: () => get().hasPermission('canUpload'),
  canEdit: () => get().hasPermission('canEdit'),
  canDelete: () => get().hasPermission('canDelete'),
  canDownload: () => get().hasPermission('canDownload'),
}));

import { create } from 'zustand';
import axios from 'axios';
import { ENV } from '@core/config/env';
import {
  User,
  UserRole,
  UserPermissions,
  SystemModuleKey,
  PermissionActionKey,
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
  setSession: (session: { token: string; refreshToken?: string; user?: User }) => void;
  refreshTokens: () => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;

  // Role and Permission Checkers
  hasRole: (...roles: (UserRole | string)[]) => boolean;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  can: (module: SystemModuleKey | string, action?: PermissionActionKey) => boolean;
  hasModule: (module: SystemModuleKey | string) => boolean;
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
   * Login action - unified login using username or employee code
   */
  login: async (credentials: LoginCredentials, _isHrm: boolean = false) => {
    set({ isLoading: true, error: null });

    try {
      const endpoint = '/auth/login';
      const response = await apiClient.post<AuthResponse>(endpoint, credentials);

      const { accessToken, refreshToken, user } = response;

      // Persist in localStorage and Cookie
      TokenStorage.setAccessToken(accessToken);
      if (refreshToken) {
        TokenStorage.setRefreshToken(refreshToken);
      }
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
   * Set or update active session
   */
  setSession: ({ token, refreshToken, user }: { token: string; refreshToken?: string; user?: User }) => {
    TokenStorage.setAccessToken(token);
    if (refreshToken) {
      TokenStorage.setRefreshToken(refreshToken);
    }
    if (user) {
      TokenStorage.setUser(user);
    }
    set((state) => ({
      token,
      user: user || state.user,
      isAuthenticated: true,
      error: null,
    }));
  },

  /**
   * Explicitly refresh tokens via POST /auth/refresh
   */
  refreshTokens: async (): Promise<boolean> => {
    const currentRefreshToken = TokenStorage.getRefreshToken();
    if (!currentRefreshToken) {
      get().logout();
      return false;
    }

    try {
      const res = await axios.post(`${ENV.API_URL}/auth/refresh`, {
        refreshToken: currentRefreshToken,
      });

      const data = res.data;
      const accessToken = data?.accessToken || data?.data?.accessToken;
      const newRefreshToken = data?.refreshToken || data?.data?.refreshToken;
      const user = data?.user || data?.data?.user;

      if (accessToken) {
        get().setSession({
          token: accessToken,
          refreshToken: newRefreshToken,
          user,
        });
        return true;
      }
      return false;
    } catch {
      get().logout();
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
    } catch {
      // If fetching profile fails (e.g., token expired), check if token was refreshed or cleared
      if (!TokenStorage.getAccessToken()) {
        get().logout();
      }
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
        // If apiClient failed with 401, the interceptor will have auto-refreshed
        // or cleared session if refresh token was invalid
        if (!TokenStorage.getAccessToken()) {
          get().logout();
        }
      }
    } else {
      // If accessToken is missing or expired, check if refreshToken exists to auto-restore session
      const refreshToken = TokenStorage.getRefreshToken();
      if (refreshToken) {
        const success = await get().refreshTokens();
        if (success) {
          set({ isInitialized: true });
          return;
        }
      }
      set({ isInitialized: true, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),

  /**
   * Check if current user has any of the specified roles
   */
  hasRole: (...roles: (UserRole | string)[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },

  /**
   * Check module-scoped action permission (RBAC Matrix V2)
   */
  can: (module: SystemModuleKey | string, action: PermissionActionKey = 'canView'): boolean => {
    const { user } = get();
    if (!user) return false;

    // Admin has full access to all modules and actions
    if (user.role === UserRole.ADMIN || user.role === 'ADMIN') {
      return true;
    }

    // DEPARTMENT_HEAD can view and download all modules, but cannot create/edit/delete
    if (user.role === UserRole.DEPARTMENT_HEAD || user.role === 'DEPARTMENT_HEAD') {
      if (action === 'canView' || action === 'canDownload') {
        return true;
      }
      return false;
    }

    // Check granular module permission matrix (V2 Dynamic RBAC)
    const upperMod = String(module).toUpperCase().replace(/-/g, '_');
    if (user.permissionsByModule && Object.keys(user.permissionsByModule).length > 0) {
      const directPerm = user.permissionsByModule[module] || user.permissionsByModule[upperMod];
      if (directPerm) {
        return Boolean(directPerm[action]);
      }
      // Legal and dispute pillar mapping fallback
      if (upperMod === 'LEGAL_DOCUMENTS' || upperMod === 'LEGAL_CASES') {
        const combined = user.permissionsByModule['LEGAL_AND_DISPUTE'] || user.permissionsByModule['legal-and-dispute'];
        if (combined) {
          return Boolean(combined[action]);
        }
      }
      if (upperMod === 'LEGAL_AND_DISPUTE') {
        const docPerm = user.permissionsByModule['LEGAL_DOCUMENTS'] || user.permissionsByModule['legal-documents'];
        const casePerm = user.permissionsByModule['LEGAL_CASES'] || user.permissionsByModule['legal-cases'];
        if (docPerm && docPerm[action]) return true;
        if (casePerm && casePerm[action]) return true;
      }
    }

    // Check accessibleModules for canView (supports both 'contracts' and 'CONTRACTS')
    if (action === 'canView' && Array.isArray(user.accessibleModules) && user.accessibleModules.length > 0) {
      const normModule = String(module).toLowerCase().replace(/_/g, '-');
      const hasAccess = user.accessibleModules.some((m) => {
        const normItem = String(m).toLowerCase().replace(/_/g, '-');
        if (normItem === normModule) return true;
        if (normModule === 'legal-and-dispute' && (normItem === 'legal-documents' || normItem === 'legal-cases')) {
          return true;
        }
        if ((normModule === 'legal-documents' || normModule === 'legal-cases') && normItem === 'legal-and-dispute') {
          return true;
        }
        return false;
      });
      if (hasAccess) return true;
    }

    // If user has modern RBAC data (permissionsByModule or accessibleModules),
    // lack of permission for this module strictly means access is DENIED.
    const hasModernRBAC = Boolean(
      (user.permissionsByModule && Object.keys(user.permissionsByModule).length > 0) ||
      (Array.isArray(user.accessibleModules) && user.accessibleModules.length > 0)
    );

    if (hasModernRBAC) {
      return false;
    }

    // Fallback to legacy user-level permission ONLY for legacy users without RBAC metadata
    return Boolean(user[action]);
  },

  /**
   * Check if user has view access to a module
   */
  hasModule: (module: SystemModuleKey | string): boolean => {
    return get().can(module, 'canView');
  },

  /**
   * Check if current user has a specific granular permission (legacy/global)
   * ADMIN has all permissions by default
   */
  hasPermission: (permission: keyof UserPermissions) => {
    const { user } = get();
    if (!user) return false;
    if (user.role === UserRole.ADMIN || user.role === 'ADMIN') return true;
    return Boolean(user[permission]);
  },

  /**
   * Convenience helpers
   */
  isAdmin: () => {
    const { user } = get();
    return user?.role === UserRole.ADMIN || user?.role === 'ADMIN';
  },

  canView: () => get().hasPermission('canView'),
  canUpload: () => get().hasPermission('canUpload'),
  canEdit: () => get().hasPermission('canEdit'),
  canDelete: () => get().hasPermission('canDelete'),
  canDownload: () => get().hasPermission('canDownload'),
}));

// Synchronize Zustand AuthStore with Axios interceptor broadcast events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:token-refreshed', (event: Event) => {
    const customEvent = event as CustomEvent<{
      accessToken: string;
      refreshToken?: string;
      user?: User;
    }>;
    const detail = customEvent?.detail;
    if (detail?.accessToken) {
      useAuthStore.getState().setSession({
        token: detail.accessToken,
        refreshToken: detail.refreshToken,
        user: detail.user,
      });
    }
  });

  window.addEventListener('auth:session-cleared', () => {
    useAuthStore.getState().logout();
  });
}


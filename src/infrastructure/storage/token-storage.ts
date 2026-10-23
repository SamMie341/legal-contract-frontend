import { STORAGE_KEYS } from '@core/constants';
import { User } from '@core/entities';

/**
 * Client-side Storage Manager for Token and User session
 */
export const TokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    // Also set standard cookie for middleware
    document.cookie = `${STORAGE_KEYS.ACCESS_TOKEN}=${token}; path=/; max-age=86400; SameSite=Lax`;
  },

  removeAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    document.cookie = `${STORAGE_KEYS.ACCESS_TOKEN}=; path=/; max-age=0; SameSite=Lax`;
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  clearSession(): void {
    this.removeAccessToken();
    this.removeUser();
  },
};

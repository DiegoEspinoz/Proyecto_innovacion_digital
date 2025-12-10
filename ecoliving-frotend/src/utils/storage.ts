import { User } from '../types';

// Funciones para manejo de token JWT
export const storage = {
  // Token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  // Usuario actual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('current_user');
    }
  },

  // Configuraciones de usuario (preferencias locales)
  getUserSettings(userId: number) {
    const settings = localStorage.getItem(`user_settings_${userId}`);
    return settings ? JSON.parse(settings) : {
      darkMode: false,
      cookiesAccepted: false,
      notifications: true,
    };
  },

  saveUserSettings(userId: number, settings: any) {
    localStorage.setItem(`user_settings_${userId}`, JSON.stringify(settings));
  },
};

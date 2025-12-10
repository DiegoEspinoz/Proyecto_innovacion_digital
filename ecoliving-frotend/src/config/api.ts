// Configuración de la API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
};

// Helper para construir URLs de la API
export const buildApiUrl = (endpoint: string): string => {
  // Si estamos en desarrollo, usar el proxy de Vite
  if (import.meta.env.DEV) {
    return `/api${endpoint}`;
  }
  // En producción, usar la URL completa
  return `${API_CONFIG.baseURL}${endpoint}`;
};

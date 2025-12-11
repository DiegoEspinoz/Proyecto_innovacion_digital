export const API_CONFIG = {
  // ⭐⭐ SIEMPRE apuntar a Render, nunca a localhost ⭐⭐
  baseURL: 'https://proyecto-innovacion-digital.onrender.com',
  timeout: 15000, // Aumenta timeout para Render
};

// Helper para construir URLs de la API
export const buildApiUrl = (endpoint: string): string => {
  // ⭐⭐ NUNCA usar proxy (/api) - tu backend está en Render ⭐⭐
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_CONFIG.baseURL}${normalizedEndpoint}`;

  console.log(`🌐 URL construida: ${url}`);
  console.log(`📍 Frontend: ${window.location.origin}`);
  console.log(`🎯 Backend: ${API_CONFIG.baseURL}`);

  return url;
};
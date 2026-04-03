const PROD_API_URL = 'https://gestor-back-production.up.railway.app';

function normalizeBaseUrl(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value.trim().replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  const envUrl = normalizeBaseUrl(process.env.REACT_APP_API_URL);
  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location?.hostname || '';
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

    if (isLocalHost) {
      return 'http://localhost:4000';
    }
  }

  return PROD_API_URL;
}

export function getApiDebugContext() {
  return {
    envApiUrl: process.env.REACT_APP_API_URL || null,
    resolvedApiUrl: getApiBaseUrl(),
    origin: typeof window !== 'undefined' ? window.location?.origin || null : null,
    hostname: typeof window !== 'undefined' ? window.location?.hostname || null : null,
  };
}

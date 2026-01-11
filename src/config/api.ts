const isDevelopment = import.meta.env.DEV;
const useLocalApi = isDevelopment && import.meta.env.VITE_USE_LOCAL_API === 'true';

export const API_CONFIG = {
  BASE_URL: useLocalApi 
    ? '/api' 
    : 'https://pathfinderhonormanager.azurewebsites.net/api',
  AUTH_AUDIENCE: 'https://pathfinderhonormanager.azurewebsites.net/api/'
};

export const AUTH0_CONFIG = {
  DOMAIN: useLocalApi 
    ? 'dev-mld3sw28.us.auth0.com'
    : 'pathfinderhonormanager.us.auth0.com',
  CLIENT_ID: useLocalApi
    ? 'qDxR5wFIxijkqnLUntMbUJpLmQkh76j3'
    : 'mfTYOD64ySERkhLAatJBxWIULeq892fK',
  REDIRECT_URI: useLocalApi
    ? 'http://localhost:3000'
    : window.location.origin
};

if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    environment: useLocalApi ? 'LOCAL' : 'PRODUCTION',
    baseUrl: API_CONFIG.BASE_URL,
    authAudience: API_CONFIG.AUTH_AUDIENCE
  });
  console.log('🔐 Auth0 Configuration:', {
    domain: AUTH0_CONFIG.DOMAIN,
    clientId: AUTH0_CONFIG.CLIENT_ID,
    redirectUri: AUTH0_CONFIG.REDIRECT_URI
  });
} 

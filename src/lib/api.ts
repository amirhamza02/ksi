/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
import axios from 'axios';


// Debug: Check if env variables are loading
console.log('ENV VARS:', {
  base: import.meta.env.VITE_API_BASE_URL,
  prefix: import.meta.env.VITE_API_AUTH_PREFIX
});

// Safely get environment variables with fallbacks
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_AUTH_PREFIX || ''}`,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '50000'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export default api;
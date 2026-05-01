import axios from 'axios';

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do not redirect on login/signup 401 (no Authorization header sent)
    const hadAuth = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && hadAuth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';
import { getToken, storeToken, clearTokens } from '../utils/tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to debug
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      data: config.data,
      dataType: typeof config.data,
      headers: config.headers
    });
    
    // Skip for login endpoint
    const isLoginEndpoint = config.url === '/auth/login/';
    
    if (!isLoginEndpoint) {
      const token = getToken('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    throw error;
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    const originalRequest = error.config;
    const isLoginEndpoint = originalRequest?.url === '/auth/login/';
    
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginEndpoint) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getToken('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh_token: refreshToken
        });
        
        if (response.data.access_token) {
          storeToken('access_token', response.data.access_token);
        }
        if (response.data.refresh_token) {
          storeToken('refresh_token', response.data.refresh_token);
        }
        
        const newAccessToken = getToken('access_token');
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        throw refreshError;
      }
    }
    
    throw error;
  }
);

export default apiClient;
import apiClient from './client';

export const authService = {
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  refresh: (refreshToken) => apiClient.post('/auth/refresh/', { refresh_token: refreshToken }),
  logout: (refreshToken) => apiClient.post('/auth/logout/', { refresh_token: refreshToken }),
  getProfile: () => apiClient.get('/auth/profile/'),
};
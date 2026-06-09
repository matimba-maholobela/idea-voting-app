import apiClient from './client';

export const authService = {
  login: (username, password) => {
  
    const data = { username, password };
    return apiClient.post('/auth/login/', data);
  },
  refresh: (refreshToken) => apiClient.post('/auth/refresh/', { refresh_token: refreshToken }),
  logout: (refreshToken) => apiClient.post('/auth/logout/', { refresh_token: refreshToken }),
  getProfile: () => apiClient.get('/auth/profile/'),
};
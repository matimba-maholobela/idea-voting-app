// src/utils/tokenManager.js
export const storeToken = (key, token) => {
  if (!token) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, token);
};

export const getToken = (key) => {
  return localStorage.getItem(key);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};
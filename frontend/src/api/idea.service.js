import apiClient from './client';

export const ideaService = {
  // Get all ideas with sorting and pagination
  getIdeas: (params) => apiClient.get('/idea/', { params }),
  
  // Get single idea
  getIdea: (id) => apiClient.get(`/idea/${id}/`),
  
  // Create new idea
  createIdea: (data) => apiClient.post('/idea/', data),
  
  // Update idea
  updateIdea: (id, data) => apiClient.put(`/idea/${id}/`, data),
  
  // Delete idea
  deleteIdea: (id) => apiClient.delete(`/idea/${id}/`),
  
  // Vote for idea
  vote: (id) => apiClient.post(`/idea/${id}/vote/`),
  
  // Remove vote from idea
  unvote: (id) => apiClient.delete(`/idea/${id}/vote/`),
};
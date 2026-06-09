import apiClient from './client';

export const ideaService = {
  // Get all ideas with sorting
  getIdeas: (params) => apiClient.get('/ideas/', { params }),
  
  // Get single idea
  getIdea: (id) => apiClient.get(`/ideas/${id}/`),
  
  // Create new idea
  createIdea: (data) => apiClient.post('/ideas/', data),
  
  // Update idea
  updateIdea: (id, data) => apiClient.put(`/ideas/${id}/`, data),
  
  // Delete idea
  deleteIdea: (id) => apiClient.delete(`/ideas/${id}/`),
  
  // Get user's own ideas
  myIdeas: () => apiClient.get('/ideas/my_ideas/'),
};
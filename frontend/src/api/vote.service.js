import apiClient from './client';

export const voteService = {
  // Cast a vote
  castVote: (ideaId) => apiClient.post(`/votes/cast/${ideaId}/`),
  
  // Remove a vote
  removeVote: (ideaId) => apiClient.delete(`/votes/remove/${ideaId}/`),
  
  // Check if user voted
  checkVote: (ideaId) => apiClient.get(`/votes/check/${ideaId}/`),
  
  // Get user's votes
  myVotes: () => apiClient.get('/votes/my-votes/'),
  
  // Get vote statistics
  getStats: () => apiClient.get('/votes/stats/'),
};
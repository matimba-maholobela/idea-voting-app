// import apiClient from './client';

// export const ideaService = {
//   // Get all ideas with sorting and pagination
//   getIdeas: (params) => apiClient.get('/idea/', { params }),
  
//   // Get single idea
//   getIdea: (id) => apiClient.get(`/idea/${id}/`),
  
//   // Create new idea
//   createIdea: (data) => apiClient.post('/idea/', data),
  
//   // Update idea
//   updateIdea: (id, data) => apiClient.put(`/idea/${id}/`, data),
  
//   // Delete idea
//   deleteIdea: (id) => apiClient.delete(`/idea/${id}/`),
  
//   // Vote for idea
//   vote: (id) => apiClient.post(`/idea/${id}/vote/`),
  
//   // Remove vote from idea
//   unvote: (id) => apiClient.delete(`/idea/${id}/vote/`),
// };

// src/api/idea.service.js (with mock data)
import { mockIdeas } from '../data/mockIdeas';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Clone mock data for modifications
let ideas = [...mockIdeas];

export const ideaService = {
  // Get all ideas with sorting
  getIdeas: async (params) => {
    await delay(800); // Simulate network delay
    
    let filteredIdeas = [...ideas];
    
    // Apply sorting
    if (params?.sort_by === 'votes') {
      filteredIdeas.sort((a, b) => b.vote_count - a.vote_count);
    } else if (params?.sort_by === 'recent') {
      filteredIdeas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    // Simple pagination
    const page = params?.page || 1;
    const pageSize = params?.page_size || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const results = filteredIdeas.slice(start, end);
    
    return {
      data: {
        results,
        pagination: {
          page,
          total_pages: Math.ceil(filteredIdeas.length / pageSize),
          total: filteredIdeas.length,
        },
      },
    };
  },
  
  // Get single idea
  getIdea: async (id) => {
    await delay(300);
    const idea = ideas.find(i => i.id === id);
    if (!idea) throw new Error('Idea not found');
    return { data: idea };
  },
  
  // Create new idea
  createIdea: async (data) => {
    await delay(500);
    const newIdea = {
      id: String(Date.now()),
      ...data,
      vote_count: 0,
      is_voted_by_user: false,
      created_by_username: 'testuser', // Current logged-in user
      created_at: new Date().toISOString(),
    };
    ideas = [newIdea, ...ideas];
    return { data: newIdea };
  },
  
  // Update idea
  updateIdea: async (id, data) => {
    await delay(400);
    const index = ideas.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Idea not found');
    ideas[index] = { ...ideas[index], ...data };
    return { data: ideas[index] };
  },
  
  // Delete idea
  deleteIdea: async (id) => {
    await delay(400);
    ideas = ideas.filter(i => i.id !== id);
    return { data: { success: true } };
  },
  
  // Vote for idea
  vote: async (id) => {
    await delay(300);
    const index = ideas.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Idea not found');
    if (ideas[index].is_voted_by_user) throw new Error('Already voted');
    
    ideas[index] = {
      ...ideas[index],
      vote_count: ideas[index].vote_count + 1,
      is_voted_by_user: true,
    };
    return { data: { vote_count: ideas[index].vote_count } };
  },
  
  // Remove vote
  unvote: async (id) => {
    await delay(300);
    const index = ideas.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Idea not found');
    if (!ideas[index].is_voted_by_user) throw new Error('Not voted yet');
    
    ideas[index] = {
      ...ideas[index],
      vote_count: ideas[index].vote_count - 1,
      is_voted_by_user: false,
    };
    return { data: { vote_count: ideas[index].vote_count } };
  },
};
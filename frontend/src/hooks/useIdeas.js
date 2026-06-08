// src/hooks/useIdeas.js
import { useState, useEffect, useCallback } from 'react';
import { ideaService } from '../api/idea.service';
import toast from 'react-hot-toast';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [sortBy, setSortBy] = useState('votes');

  const fetchIdeas = useCallback(async (page = 1, sort = sortBy) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ideaService.getIdeas({ 
        page, 
        page_size: 10,
        sort_by: sort 
      });
      setIdeas(response.data.results || []);
      setPagination(response.data.pagination || {
        page: 1,
        totalPages: 1,
        total: 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ideas');
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas, sortBy]);

  const createIdea = async (ideaData) => {
    try {
      const response = await ideaService.createIdea(ideaData);
      toast.success('Idea created successfully!');
      await fetchIdeas(pagination.page, sortBy);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create idea';
      toast.error(message);
      throw err;
    }
  };

  const voteIdea = async (ideaId) => {
    try {
      const response = await ideaService.vote(ideaId);
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, vote_count: response.data.vote_count, is_voted_by_user: true }
          : idea
      ));
      toast.success('Vote recorded!');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to vote';
      toast.error(message);
      throw err;
    }
  };

  const unvoteIdea = async (ideaId) => {
    try {
      const response = await ideaService.unvote(ideaId);
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, vote_count: response.data.vote_count, is_voted_by_user: false }
          : idea
      ));
      toast.success('Vote removed');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to remove vote';
      toast.error(message);
      throw err;
    }
  };

  const deleteIdea = async (ideaId) => {
    try {
      await ideaService.deleteIdea(ideaId);
      toast.success('Idea deleted');
      await fetchIdeas(pagination.page, sortBy);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete idea';
      toast.error(message);
      throw err;
    }
  };

  return {
    ideas,
    loading,
    error,
    pagination,
    sortBy,
    setSortBy,
    fetchIdeas,
    createIdea,
    voteIdea,
    unvoteIdea,
    deleteIdea,
  };
};
import { useState, useEffect, useCallback } from 'react';
import { ideaService } from '../api/idea.service';
import { voteService } from '../api/vote.service';
import toast from 'react-hot-toast';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('votes');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ideaService.getIdeas({ 
        sort_by: sortBy,
        page: page,
        page_size: 10
      });
      setIdeas(response.data.results || []);
      setTotal(response.data.count || 0);
      setHasMore(response.data.next !== null);
      setError(null);
    } catch (err) {
      const errorMessage = 'Failed to load ideas';
      setError(errorMessage);
      toast.error(errorMessage);
     
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [sortBy, page]);

  useEffect(() => {
    fetchIdeas().catch(err => {
      // Silent catch for the effect's error since we already handle UI feedback
      console.error('Fetch ideas failed:', err);
    });
  }, [fetchIdeas]);

  const createIdea = async (ideaData) => {
    try {
      const response = await ideaService.createIdea(ideaData);
      toast.success('Idea created successfully!');
      await fetchIdeas();
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create idea';
      toast.error(message);
     
      throw new Error(message);
    }
  };

  const updateIdea = async (id, ideaData) => {
    try {
      const response = await ideaService.updateIdea(id, ideaData);
      toast.success('Idea updated successfully!');
      await fetchIdeas();
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update idea';
      toast.error(message);
      throw new Error(message);
    }
  };

  const deleteIdea = async (id) => {
    try {
      await ideaService.deleteIdea(id);
      toast.success('Idea deleted');
      await fetchIdeas();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete idea';
      toast.error(message);
      throw new Error(message);
    }
  };

  const voteIdea = async (ideaId) => {
    try {
      const response = await voteService.castVote(ideaId);
     
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
      throw new Error(message);
    }
  };

  const unvoteIdea = async (ideaId) => {
    try {
      const response = await voteService.removeVote(ideaId);
     
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
      throw new Error(message);
    }
  };

  return {
    ideas,
    loading,
    error,
    sortBy,
    setSortBy,
    page,
    setPage,
    hasMore,
    total,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    voteIdea,
    unvoteIdea,
  };
};
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ideaService } from '../api/idea.service';
import { 
  FiLogOut, 
  FiUser, 
  FiThumbsUp, 
  FiTrendingUp, 
  FiClock, 
  FiPlus, 
  FiX,
  FiSend,
  FiTrash2,
  FiMessageCircle,
  FiCalendar,
  FiLoader,
  FiAward,
  FiHeart,
  FiStar,
  FiZap
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const IdeasPage = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('votes');
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const res = await ideaService.getIdeas({ sort_by: sortBy });
      setIdeas(res.data.results || []);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadIdeas();
  }, [isAuthenticated, sortBy]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Both fields are required');
      return;
    }

    setSubmitting(true);
    try {
      await ideaService.createIdea({ title, description });
      toast.success('Idea posted!');
      setTitle('');
      setDescription('');
      setFormOpen(false);
      loadIdeas();
    } catch (err) {
      toast.error('Failed to post idea');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id) => {
    try {
      const res = await ideaService.vote(id);
      setIdeas(prev => prev.map(idea => 
        idea.id === id 
          ? { ...idea, vote_count: res.data.vote_count, is_voted_by_user: true }
          : idea
      ));
      toast.success('Voted!');
    } catch {
      toast.error('Already voted');
    }
  };

  const handleUnvote = async (id) => {
    try {
      const res = await ideaService.unvote(id);
      setIdeas(prev => prev.map(idea => 
        idea.id === id 
          ? { ...idea, vote_count: res.data.vote_count, is_voted_by_user: false }
          : idea
      ));
      toast.success('Vote removed');
    } catch {
      toast.error('Failed to remove vote');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this idea?')) return;
    try {
      await ideaService.deleteIdea(id);
      toast.success('Deleted');
      loadIdeas();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.ceil((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString();
  };

  const totalVotes = ideas.reduce((sum, i) => sum + i.vote_count, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <FiStar className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Ideas</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <FiUser className="w-4 h-4" />
              <span>{user?.username}</span>
            </div>
            <button onClick={logout} className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1">
              <FiLogOut className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* New Idea Button */}
        {!formOpen ? (
          <button
            onClick={() => setFormOpen(true)}
            className="w-full mb-6 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            New Idea
          </button>
        ) : (
          <div className="bg-white rounded-lg border p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium text-gray-900">Share an idea</h2>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        )}

        {/* Stats + Sort */}
        {ideas.length > 0 && (
          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex items-center gap-3 text-gray-500">
              <span className="flex items-center gap-1">
                <FiMessageCircle className="w-4 h-4" />
                {ideas.length}
              </span>
              <span className="flex items-center gap-1">
                <FiAward className="w-4 h-4" />
                {totalVotes}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSortBy('votes')}
                className={`px-3 py-1 rounded-md text-sm ${sortBy === 'votes' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
              >
                <FiTrendingUp className="w-4 h-4 inline mr-1" />
                Top
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1 rounded-md text-sm ${sortBy === 'recent' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
              >
                <FiClock className="w-4 h-4 inline mr-1" />
                New
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <FiLoader className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          </div>
        )}

        {/* Empty State */}
        {!loading && ideas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiZap className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No ideas yet</p>
            <button
              onClick={() => setFormOpen(true)}
              className="mt-3 text-blue-600 text-sm hover:underline"
            >
              Be the first
            </button>
          </div>
        )}

        {/* Ideas List */}
        {!loading && ideas.length > 0 && (
          <div className="space-y-3">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-lg border p-4 hover:shadow-sm transition">
                <div className="flex justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{idea.title}</h3>
                    <p className="text-gray-600 text-sm">{idea.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                      <span className="flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        {idea.created_by_username || 'anon'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {formatDate(idea.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiHeart className="w-3 h-3" />
                        {idea.vote_count}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {idea.created_by_username === user?.username && (
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                    {idea.is_voted_by_user ? (
                      <button
                        onClick={() => handleUnvote(idea.id)}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <FiThumbsUp className="w-4 h-4" />
                        Voted
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVote(idea.id)}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 flex items-center gap-1"
                      >
                        <FiThumbsUp className="w-4 h-4" />
                        Vote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeasPage;
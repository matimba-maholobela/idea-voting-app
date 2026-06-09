import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useIdeas } from '../hooks/useIdeas';
import { voteService } from '../api/vote.service';
import IdeaCard from '../components/ideas/IdeaCard';
import IdeaFormModal from '../components/ideas/IdeaFormModal';
import { 
  FiLogOut, 
  FiUser, 
  FiTrendingUp, 
  FiClock, 
  FiPlus, 
  FiLoader, 
  FiBarChart2,
  FiList,
  FiMessageSquare,
  FiHeart,
  FiEdit2,
  FiThumbsUp,
  FiAward,
  FiCalendar
} from 'react-icons/fi';

const IdeasPage = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    ideas,
    loading,
    sortBy,
    setSortBy,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    voteIdea,
    unvoteIdea,
  } = useIdeas();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [activeTab, setActiveTab] = useState('ideas');
  const [stats, setStats] = useState({
    total_votes: 0,
    most_voted_idea: null,
    most_voted_count: 0,
  });
  const [userVotes, setUserVotes] = useState([]);
  const [userIdeasList, setUserIdeasList] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchIdeas();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (ideas.length > 0 && user) {
      setUserIdeasList(ideas.filter(i => i.created_by_username === user?.username));
    }
  }, [ideas, user]);

  const fetchStats = async () => {
    try {
      const [statsRes, myVotesRes] = await Promise.all([
        voteService.getStats(),
        voteService.myVotes()
      ]);
      
      setStats({
        total_votes: statsRes.data.total_votes || 0,
        most_voted_idea: statsRes.data.most_voted_idea,
        most_voted_count: statsRes.data.most_voted_count || 0,
      });
      setUserVotes(myVotesRes.data.votes || []);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffDays = differenceInDays(now, date);

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return format(date, 'MMM d, yyyy');
  };

  if (!authLoading && !isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingIdea(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editingIdea) {
      await updateIdea(editingIdea.id, data);
    } else {
      await createIdea(data);
    }
    await fetchStats();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const userIdeasCount = userIdeasList.length;

  // Stats Tab
  const StatsTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Ideas</p>
              <p className="text-2xl font-semibold text-gray-900">{ideas.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FiMessageSquare className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Votes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_votes}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <FiHeart className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Your Ideas</p>
              <p className="text-2xl font-semibold text-gray-900">{userIdeasCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FiEdit2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Your Votes</p>
              <p className="text-2xl font-semibold text-gray-900">{userVotes.length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FiThumbsUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Idea */}
      {stats.most_voted_idea && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <FiAward className="w-5 h-5 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-700 uppercase tracking-wide">Most Popular</span>
          </div>
          <p className="text-lg font-medium text-gray-900">{stats.most_voted_idea}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.most_voted_count} votes</p>
        </div>
      )}

      {/* Your Ideas History */}
      {userIdeasList.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <FiList className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Ideas you've shared</span>
            <span className="text-xs text-gray-400 ml-auto">{userIdeasList.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {userIdeasList.slice(0, 5).map((idea) => (
              <div key={idea.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <p className="text-sm font-medium text-gray-900">{idea.title}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiHeart className="w-3 h-3" />
                    {idea.vote_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    {formatDate(idea.created_at)}
                  </span>
                </div>
              </div>
            ))}
            {userIdeasList.length > 5 && (
              <div className="px-5 py-3 text-center text-xs text-gray-400 bg-gray-50">
                +{userIdeasList.length - 5} more ideas
              </div>
            )}
          </div>
        </div>
      )}

      {/* Your Vote History */}
      {userVotes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <FiThumbsUp className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Ideas you've voted for</span>
            <span className="text-xs text-gray-400 ml-auto">{userVotes.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {userVotes.slice(0, 5).map((vote) => (
              <div key={vote.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <p className="text-sm text-gray-900">{vote.idea_title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  <FiCalendar className="w-3 h-3 inline mr-1" />
                  {formatDate(vote.created_at)}
                </p>
              </div>
            ))}
            {userVotes.length > 5 && (
              <div className="px-5 py-3 text-center text-xs text-gray-400 bg-gray-50">
                +{userVotes.length - 5} more votes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Ideas Tab
  const IdeasTab = () => (
    <>
      <button
        onClick={handleCreate}
        className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
      >
        <FiPlus className="w-5 h-5" />
        Share an idea
      </button>

      <div className="flex justify-between items-center mb-5">
        <span className="text-sm text-gray-500">{ideas.length} ideas</span>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('votes')}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${
              sortBy === 'votes'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiTrendingUp className="w-3.5 h-3.5" />
            Most Votes
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${
              sortBy === 'recent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiClock className="w-3.5 h-3.5" />
            Most Recent
          </button>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No ideas yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onVote={voteIdea}
              onUnvote={unvoteIdea}
              onDelete={deleteIdea}
              onEdit={handleEdit}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <Helmet>
        <title>{activeTab === 'ideas' ? 'Ideas' : 'Stats'} | Vote Your Ideas</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Ideas</h1>
                  <p className="text-xs text-gray-500">Share, vote, and innovate</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4">
              <button
                onClick={() => setActiveTab('ideas')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'ideas'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiList className="w-4 h-4" />
                Ideas
                {activeTab !== 'ideas' && <span className="ml-1 text-xs">{ideas.length}</span>}
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'stats'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiBarChart2 className="w-4 h-4" />
                Stats
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'ideas' ? <IdeasTab /> : <StatsTab />}
        </main>

        {/* Modal */}
        <IdeaFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingIdea(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingIdea}
        />
      </div>
    </>
  );
};

export default IdeasPage;
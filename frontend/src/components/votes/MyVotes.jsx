import React, { useState, useEffect } from 'react';
import { FiHeart, FiClock, FiChevronRight } from 'react-icons/fi';
import { voteService } from '../../api/vote.service';
import { Link } from 'react-router-dom';

const MyVotes = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyVotes = async () => {
      try {
        const response = await voteService.myVotes();
        setVotes(response.data.votes || []);
      } catch (error) {
        console.error('Failed to fetch my votes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyVotes();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (votes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <FiHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">You haven't voted on any ideas yet</p>
        <Link to="/ideas" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
          Browse Ideas →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <FiHeart className="w-4 h-4 text-red-500" />
          <h3 className="font-medium text-gray-900">Your Votes</h3>
          <span className="text-xs text-gray-500 ml-auto">{votes.length} votes</span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {votes.map((vote) => (
          <Link
            key={vote.id}
            to={`/ideas/${vote.idea}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{vote.idea_title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {formatDate(vote.created_at)}
                  </span>
                </div>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyVotes;
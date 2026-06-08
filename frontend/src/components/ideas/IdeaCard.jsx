import React, { useState } from 'react';
import { FiThumbsUp, FiMessageCircle, FiClock, FiUser, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const IdeaCard = ({ idea, onVote, onUnvote, onDelete, isOwner = false }) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVoteClick = async () => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      if (idea.is_voted_by_user) {
        await onUnvote(idea.id);
      } else {
        await onVote(idea.id);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const formattedDate = formatDistanceToNow(new Date(idea.created_at), { addSuffix: true });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h3>
          <p className="text-gray-600 text-sm">{idea.description}</p>
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete(idea.id)}
            className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete idea"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <FiUser className="h-4 w-4" />
          <span>{idea.created_by_username || 'Anonymous'}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiClock className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiMessageCircle className="h-4 w-4" />
          <span>{idea.vote_count} votes</span>
        </div>
      </div>

      {/* Vote Button */}
      <button
        onClick={handleVoteClick}
        disabled={isVoting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200
          ${idea.is_voted_by_user 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isVoting ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <FiThumbsUp className="h-5 w-5" />
        )}
        <span>{idea.is_voted_by_user ? 'Voted' : 'Vote'}</span>
        {!idea.is_voted_by_user && idea.vote_count > 0 && (
          <span className="ml-1">({idea.vote_count})</span>
        )}
      </button>
    </div>
  );
};

export default IdeaCard;
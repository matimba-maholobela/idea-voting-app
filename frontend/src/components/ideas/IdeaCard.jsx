import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiThumbsUp, FiUser, FiCalendar, FiHeart, FiTrash2, FiEdit2 } from 'react-icons/fi';

const IdeaCard = ({ idea, onVote, onUnvote, onDelete, onEdit, currentUser }) => {
  const [isVoting, setIsVoting] = useState(false);
  const isOwner = idea.created_by_username === currentUser?.username;
  const hasVoted = idea.is_voted_by_user;

  const handleVoteClick = async () => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      if (hasVoted) {
        await onUnvote(idea.id);
      } else {
        await onVote(idea.id);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{idea.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FiUser className="w-3 h-3" />
              {idea.created_by_username}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar className="w-3 h-3" />
              {formatDate(idea.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <FiHeart className="w-3 h-3" />
              {idea.vote_count} {idea.vote_count === 1 ? 'vote' : 'votes'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <button
                onClick={() => onEdit(idea)}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                title="Edit idea"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(idea.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete idea"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </>
          )}
          
          <button
            onClick={handleVoteClick}
            disabled={isVoting}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              hasVoted 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isVoting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiThumbsUp className="w-4 h-4" />
            )}
            {hasVoted ? 'Voted' : 'Vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

IdeaCard.propTypes = {
  idea: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    vote_count: PropTypes.number.isRequired,
    created_by_username: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    is_voted_by_user: PropTypes.bool.isRequired,
  }).isRequired,
  onVote: PropTypes.func.isRequired,
  onUnvote: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string,
  }),
};

export default IdeaCard;
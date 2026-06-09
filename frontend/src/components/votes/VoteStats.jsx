import React, { useState, useEffect, useCallback } from 'react';
import { FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { voteService } from '../../api/vote.service';
import StatCard from '../common/statcard/StatCard';
import LoadingSkeleton from '../common/LoadingSkeleton/LoadingSkeleton';
import { statCardsConfig } from '../../config/stats';
import toast from 'react-hot-toast';

const VoteStats = () => {
  const [stats, setStats] = useState({
    total_votes: 0,
    unique_voters: 0,
    most_voted_idea: null,
    most_voted_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      const response = await voteService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch vote stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Calculate derived stats
  const avgVotesPerVoter = stats.total_votes > 0 && stats.unique_voters > 0
    ? (stats.total_votes / stats.unique_voters).toFixed(1)
    : 0;

  // Prepare stats data with calculated values
  const statsData = {
    ...stats,
    avg_votes: avgVotesPerVoter,
  };

  // Get value for each stat card
  const getStatValue = (config) => {
    if (config.key === 'avg_votes') {
      return avgVotesPerVoter;
    }
    return statsData[config.key];
  };

  // Get subtitle for each stat card
  const getStatSubtitle = (config) => {
    if (typeof config.subtitle === 'function') {
      return config.subtitle(stats);
    }
    return config.subtitle;
  };

  // Get formatted value
  const getFormattedValue = (config, value) => {
    if (config.formatter) {
      return config.formatter(value);
    }
    return value;
  };

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FiBarChart2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Voting Statistics</h2>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsConfig.map((config) => {
          const value = getStatValue(config);
          const formattedValue = getFormattedValue(config, value);
          const subtitle = getStatSubtitle(config);
          
          return (
            <StatCard
              key={config.id}
              icon={config.icon}
              title={config.title}
              value={formattedValue}
              color={config.color}
              subtitle={subtitle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VoteStats;
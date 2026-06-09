import { FiHeart, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi';

export const statCardsConfig = [
  {
    id: 'stat-total-votes',
    icon: FiHeart,
    title: 'Total Votes',
    key: 'total_votes',
    color: 'red',
    subtitle: 'All time votes',
    formatter: (value) => value.toLocaleString(),
  },
  {
    id: 'stat-unique-voters',
    icon: FiUsers,
    title: 'Unique Voters',
    key: 'unique_voters',
    color: 'blue',
    subtitle: 'Active participants',
    formatter: (value) => value.toLocaleString(),
  },
  {
    id: 'stat-most-voted',
    icon: FiAward,
    title: 'Most Voted Idea',
    key: 'most_voted_idea',
    color: 'yellow',
    subtitle: (stats) => `${stats.most_voted_count || 0} votes`,
    formatter: (value) => value || 'No votes yet',
  },
  {
    id: 'stat-avg-votes',
    icon: FiTrendingUp,
    title: 'Avg Votes per Voter',
    key: 'avg_votes',
    color: 'green',
    subtitle: 'Per participant',
    formatter: (value) => value,
  },
];
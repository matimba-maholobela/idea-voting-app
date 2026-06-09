import React from 'react';
import PropTypes from 'prop-types';

const LoadingSkeleton = ({ count = 4, className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => ({
    id: `skeleton-${i}`,
  }));

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {skeletons.map((skeleton) => (
        <div
          key={skeleton.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
};

LoadingSkeleton.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
};

LoadingSkeleton.defaultProps = {
  count: 4,
  className: '',
};

export default LoadingSkeleton;
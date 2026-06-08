import React from 'react';
import { FiLightbulb } from 'react-icons/fi';

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <FiLightbulb className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
      <p className="text-gray-500">Be the first to share an idea!</p>
    </div>
  );
};

export default EmptyState;
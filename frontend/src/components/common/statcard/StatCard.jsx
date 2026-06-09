import React from 'react';
import PropTypes from 'prop-types';
import { getColorVariant } from '../../../config/colors';

const StatCard = ({ icon: Icon, title, value, color, subtitle }) => {
  const bgColor = getColorVariant(color, 'bg');
  const textColor = getColorVariant(color, 'text');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.oneOf(['red', 'blue', 'green', 'yellow', 'purple', 'indigo', 'gray']),
  subtitle: PropTypes.string,
};

StatCard.defaultProps = {
  color: 'blue',
  subtitle: null,
};

export default StatCard;
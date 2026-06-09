// src/config/colors.js
export const colorVariants = {
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    hover: 'hover:bg-red-50',
    border: 'border-red-200',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-50',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    hover: 'hover:bg-green-50',
    border: 'border-green-200',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    hover: 'hover:bg-yellow-50',
    border: 'border-yellow-200',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-50',
    border: 'border-purple-200',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    hover: 'hover:bg-indigo-50',
    border: 'border-indigo-200',
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    hover: 'hover:bg-gray-50',
    border: 'border-gray-200',
  },
};

export const getColorVariant = (color, variant = 'bg') => {
  return colorVariants[color]?.[variant] || colorVariants.blue[variant];
};
import React from 'react';

export default function DifficultyBadge({ difficulty }) {
  const styles = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200'
  };

  const style = styles[difficulty] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${style}`}>
      {difficulty}
    </span>
  );
}

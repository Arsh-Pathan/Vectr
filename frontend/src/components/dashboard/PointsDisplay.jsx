import React from 'react';
import Card from '../common/Card';
import { Award } from 'lucide-react';

export default function PointsDisplay({ points }) {
  const nextLevelThreshold = Math.ceil(points / 100) * 100 + (points % 100 === 0 ? 100 : 0);
  
  return (
    <Card className="flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 font-medium mb-1">Total Points</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-gray-900">{points}</span>
          <span className="text-sm text-gray-500">pts</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Next level at {nextLevelThreshold}</p>
      </div>
      
      <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-google-yellow">
        <Award size={32} />
      </div>
    </Card>
  );
}

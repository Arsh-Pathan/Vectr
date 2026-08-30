import React from 'react';
import Card from '../common/Card';
import { Flame, CheckCircle, Target } from 'lucide-react';

export default function StatsOverview({ streak, issuesSolved, challengesCompleted }) {
  return (
    <Card>
      <h3 className="text-gray-500 font-medium mb-4">Quick Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg overflow-hidden">
          <div className="w-10 h-10 shrink-0 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
            <Flame size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-bold truncate">{streak} Days</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium truncate">Current Streak</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg overflow-hidden">
          <div className="w-10 h-10 shrink-0 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-bold truncate">{issuesSolved}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium truncate">Issues Solved</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg overflow-hidden">
          <div className="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Target size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-bold truncate">{challengesCompleted}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium truncate">Daily Challenges</div>
          </div>
        </div>

      </div>
    </Card>
  );
}

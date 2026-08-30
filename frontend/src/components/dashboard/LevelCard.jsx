import React from 'react';
import Card from '../common/Card';

export default function LevelCard({ level, tier }) {
  const percentage = (level % 10) * 10; // Simple calculation for progress to next level
  
  return (
    <Card className="flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 font-medium mb-1">Current Level</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-gray-900">{level}</span>
          <span className="text-sm font-medium text-google-blue uppercase px-2 py-0.5 bg-blue-50 rounded-full">
            {tier}
          </span>
        </div>
      </div>
      
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F3F4" strokeWidth="8" />
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="#4285F4" 
            strokeWidth="8" 
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * percentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-500">{percentage}%</span>
        </div>
      </div>
    </Card>
  );
}

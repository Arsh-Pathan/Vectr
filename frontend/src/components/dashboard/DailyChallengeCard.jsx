import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Star, Code, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DailyChallengeCard({ challenge }) {
  const navigate = useNavigate();

  if (!challenge) return null;

  return (
    <Card className="border-2 border-google-yellow shadow-md bg-gradient-to-r from-white to-yellow-50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2 text-google-yellow font-bold uppercase text-sm tracking-wider">
          <Star size={16} className="fill-current" />
          <span>Daily Challenge</span>
        </div>
        <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-google-blue border border-blue-100">
          +{challenge.points_reward} pts
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
        {challenge.title}
      </h2>
      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
        {challenge.description}
      </p>

      <div className="flex items-center gap-2 mb-6 text-xs font-medium text-gray-500">
        <Code size={14} />
        <span>{challenge.repo_full_name}</span>
        <span>•</span>
        <span className="text-green-600 capitalize">{challenge.difficulty}</span>
      </div>

      <Button 
        onClick={() => navigate(`/issue/${challenge.id}`)}
        className="w-full flex items-center justify-center gap-2"
      >
        Take Challenge <ArrowRight size={16} />
      </Button>
    </Card>
  );
}

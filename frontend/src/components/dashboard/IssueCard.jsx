import React from 'react';
import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';
import { GitPullRequest, ArrowRight } from 'lucide-react';

export default function IssueCard({ issue }) {
  const navigate = useNavigate();

  const difficultyColors = {
    beginner: 'text-green-700 bg-green-100 border-green-200',
    moderate: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    advanced: 'text-red-700 bg-red-100 border-red-200'
  };

  return (
    <Card className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-google-blue cursor-pointer transition-colors" onClick={() => navigate(`/issue/${issue.id}`)}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${difficultyColors[issue.difficulty] || 'bg-gray-100'}`}>
            {issue.difficulty}
          </span>
          <span className="text-sm font-medium text-gray-500">{issue.repo_full_name}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-google-blue">
          {issue.title}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {issue.required_skills?.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              {skill}
            </span>
          ))}
          {issue.required_skills?.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded text-xs">+{issue.required_skills.length - 3}</span>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
        <div className="text-center">
          <div className="text-sm text-gray-500 font-medium mb-1">Reward</div>
          <div className="text-xl font-bold text-google-blue">+{issue.points_reward}</div>
        </div>
        <button className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-google-blue transition-colors">
          Solve <ArrowRight size={16} />
        </button>
      </div>
    </Card>
  );
}

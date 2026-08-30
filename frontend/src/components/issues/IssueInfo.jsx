import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import DifficultyBadge from './DifficultyBadge';
import { ExternalLink, CheckCircle } from 'lucide-react';
import api from '../../config/api';

export default function IssueInfo({ issue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prUrl, setPrUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmitPR = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call to mark as complete
      // await api.post(`/issues/${issue.id}/complete`, { pr_url: prUrl });
      await new Promise(res => setTimeout(res, 1000));
      setCompleted(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to submit PR', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col" hover={false}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <DifficultyBadge difficulty={issue.difficulty} />
            <span className="text-sm font-medium text-gray-500">{issue.repo_full_name}</span>
          </div>
          <span className="font-bold text-google-blue">+{issue.points_reward} pts</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{issue.title}</h1>
        
        <div className="prose prose-sm text-gray-700 mb-6 flex-1">
          <p>{issue.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {issue.required_skills?.map(skill => (
              <span key={skill} className="px-2.5 py-1 bg-blue-50 text-google-blue rounded text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Labels</h3>
          <div className="flex flex-wrap gap-2">
            {issue.labels?.map(label => (
              <span key={label} className="px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded text-xs">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
          <a 
            href={issue.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ExternalLink size={16} /> View on GitHub
          </a>
          
          <div className="flex-1" />
          
          {completed ? (
            <span className="flex items-center gap-2 text-green-600 font-bold px-4 py-2 bg-green-50 rounded-full">
              <CheckCircle size={20} /> Completed
            </span>
          ) : (
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <CheckCircle size={18} /> Mark as Complete
            </Button>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Pull Request">
        <form onSubmit={handleSubmitPR}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pull Request URL</label>
            <input 
              type="url" 
              required
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-google-blue outline-none transition-all"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Submit PR'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

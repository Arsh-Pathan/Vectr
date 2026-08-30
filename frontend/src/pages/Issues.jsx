import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import IssueCard from '../components/dashboard/IssueCard';
import Loader from '../components/common/Loader';
import api from '../config/api';

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await api.get('/issues');
        setIssues(res.data?.issues || res.data || []);
      } catch (error) {
        console.log('Using mock issues data');
        setIssues([
          { id: '1', repo_full_name: 'react-ui-lib', title: 'Add dark mode support', difficulty: 'moderate', points_reward: 25, required_skills: ['React', 'CSS'] },
          { id: '2', repo_full_name: 'node-tools', title: 'Fix memory leak in worker', difficulty: 'moderate', points_reward: 25, required_skills: ['JavaScript'] },
          { id: '3', repo_full_name: 'open-api', title: 'Update API docs', difficulty: 'beginner', points_reward: 10, required_skills: ['Markdown'] },
          { id: '4', repo_full_name: 'freeCodeCamp/freeCodeCamp', title: 'Fix input validation in signup form', difficulty: 'beginner', points_reward: 20, required_skills: ['JavaScript', 'Regex'] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Issues</h1>
          <p className="text-text-secondary">Discover issues matched to your skill level and start contributing.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {issues.length > 0 ? (
              <div className="grid gap-4">
                {issues.map(issue => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-700 mb-1">No issues available</h3>
                <p className="text-sm text-gray-400 max-w-xs">We couldn't find any issues matching your profile right now. Check back later!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

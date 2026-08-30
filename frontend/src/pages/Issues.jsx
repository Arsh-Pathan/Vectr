import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import IssueCard from '../components/dashboard/IssueCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import api from '../config/api';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const LANGUAGES = ['JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'Ruby'];

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [language, setLanguage] = useState('');
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const params = { limit };
        if (difficulty) params.difficulty = difficulty;
        if (language) params.language = language;
        
        const res = await api.get('/issues', { params });
        setIssues(res.data?.issues || res.data || []);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [difficulty, language, limit]);

  // Client-side search filter
  const filteredIssues = useMemo(() => {
    if (!searchQuery) return issues;
    const lowerQuery = searchQuery.toLowerCase();
    return issues.filter(issue => 
      issue.title?.toLowerCase().includes(lowerQuery) || 
      issue.repo_full_name?.toLowerCase().includes(lowerQuery) ||
      issue.description?.toLowerCase().includes(lowerQuery)
    );
  }, [issues, searchQuery]);

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Issues</h1>
          <p className="text-text-secondary">Discover issues matched to your skill level and start contributing.</p>
        </div>
        
        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title, repo, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue outline-none bg-white min-w-[140px]"
            >
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map(diff => (
                <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
              ))}
            </select>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue outline-none bg-white min-w-[140px]"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && issues.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredIssues.length > 0 ? (
              <>
                <div className="grid gap-4">
                  {filteredIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
                
                {/* Pagination / Load More */}
                {issues.length >= limit && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => setLimit(prev => prev + 20)}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More Issues'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-700 mb-1">No issues found</h3>
                <p className="text-sm text-gray-400 max-w-xs">Try adjusting your filters or search query to find more issues.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

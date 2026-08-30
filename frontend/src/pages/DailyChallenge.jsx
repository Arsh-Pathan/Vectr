import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import IssueCard from '../components/dashboard/IssueCard';
import Loader from '../components/common/Loader';
import api from '../config/api';

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        setLoading(true);
        const res = await api.get('/issues/daily');
        setChallenge(res.data);
      } catch (err) {
        console.error('Failed to fetch daily challenge:', err);
        setError('No daily challenge available right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-10 text-center">
          <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full font-bold text-sm tracking-wider uppercase mb-4 shadow-sm border border-yellow-200">
            🔥 Challenge of the Day
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Level Up Your Skills</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Earn bonus points by completing today's hand-picked issue. Maintain your daily streak to multiply your rewards!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <span className="text-3xl">☕</span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">You're all caught up!</h3>
            <p className="text-gray-500 max-w-md">{error}</p>
          </div>
        ) : challenge ? (
          <div className="max-w-3xl mx-auto transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gradient-to-r from-google-blue to-purple-600 rounded-t-xl h-3 w-full"></div>
            <div className="bg-white rounded-b-xl shadow-lg border-x border-b border-gray-100 p-1">
              <IssueCard issue={challenge} hidePoints={false} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

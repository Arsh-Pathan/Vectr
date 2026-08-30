import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import LevelCard from '../components/dashboard/LevelCard';
import PointsDisplay from '../components/dashboard/PointsDisplay';
import StatsOverview from '../components/dashboard/StatsOverview';
import DailyChallengeCard from '../components/dashboard/DailyChallengeCard';
import IssueCard from '../components/dashboard/IssueCard';
import Loader from '../components/common/Loader';
import api from '../config/api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app we'd Promise.all these
        // Using mock data as fallback if API fails
        try {
          const profileRes = await api.get('/developer/profile');
          setProfile(profileRes.data);

          const statsRes = await api.get('/developer/stats');
          setStats(statsRes.data);

          const issuesRes = await api.get('/issues');
          setIssues(issuesRes.data.issues || []);

          const dailyRes = await api.get('/issues/daily');
          setDailyChallenge(dailyRes.data);
        } catch (error) {
          console.error("Failed to load dashboard data", error);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-text-secondary">Welcome back! Here's your current progress and recommended issues.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="space-y-6 lg:col-span-1">
            {profile && <LevelCard level={profile.level} tier={profile.tier} />}
            {profile && <PointsDisplay points={profile.points} />}
            {stats && (
              <StatsOverview 
                streak={stats.current_streak} 
                issuesSolved={stats.total_issues_solved}
                challengesCompleted={stats.daily_challenges_completed}
              />
            )}
          </div>

          {/* Right Column - Issues */}
          <div className="space-y-8 lg:col-span-2">

            {dailyChallenge ? (
              <section>
                <DailyChallengeCard challenge={dailyChallenge} />
              </section>
            ) : (
              <section className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                <div className="text-5xl mb-3">🎯</div>
                <h3 className="font-bold text-gray-700 mb-1">No daily challenge today</h3>
                <p className="text-sm text-gray-400">Check back tomorrow — a new challenge drops every day.</p>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span role="img" aria-label="clipboard">📋</span> Recommended Issues
              </h2>

              {issues.length > 0 ? (
                <div className="space-y-4">
                  {issues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-700 mb-1">No issues matched yet</h3>
                  <p className="text-sm text-gray-400 max-w-xs">Keep leveling up and connecting GitHub — we'll find the perfect issues for your skill level.</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

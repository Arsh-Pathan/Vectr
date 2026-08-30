import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import LevelCard from '../components/dashboard/LevelCard';
import StatsOverview from '../components/dashboard/StatsOverview';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';
import BadgeShowcase from '../components/profile/BadgeShowcase';
import ContributionList from '../components/profile/ContributionList';
import api from '../config/api';
import { User, MapPin, Link as LinkIcon } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        try {
          const res = await api.get('/developer/profile');
          setProfile(res.data);
        } catch {
          setProfile({
            github_username: 'sahilkumavat',
            display_name: 'Sahil Kumavat',
            avatar_url: null,
            level: 23,
            tier: 'moderate',
            points: 450,
            badges: [
              { id: '1', name: 'First PR', type: 'milestone', color: 'gold', description: 'Merged your first pull request' },
              { id: '2', name: '5-Day Streak', type: 'streak', color: 'blue', description: 'Contributed 5 days in a row' },
              { id: '3', name: 'Speed Solver', type: 'speed', color: 'silver', description: 'Solved an issue in under 1 hour' },
            ]
          });
        }

        try {
          const res = await api.get('/developer/stats');
          setStats(res.data);
        } catch {
          setStats({
            current_streak: 5,
            total_issues_solved: 12,
            daily_challenges_completed: 3,
            heatmap: Array.from({ length: 20 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - i * 2);
              return { date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 4) + 1 };
            })
          });
        }

        try {
          const res = await api.get('/developer/contributions');
          setContributions(res.data);
        } catch {
          setContributions([
            { id: 'c1', issue_title: 'Fix input validation in signup form', repo_full_name: 'freeCodeCamp/freeCodeCamp', completed_at: new Date(Date.now() - 86400000).toISOString(), points_earned: 10, pr_url: 'https://github.com' },
            { id: 'c2', issue_title: 'Update API documentation for v2 endpoints', repo_full_name: 'node-tools/node-tools', completed_at: new Date(Date.now() - 3 * 86400000).toISOString(), points_earned: 15, pr_url: 'https://github.com' },
            { id: 'c3', issue_title: 'Add dark mode support to sidebar', repo_full_name: 'react-ui-lib/react-ui', completed_at: new Date(Date.now() - 7 * 86400000).toISOString(), points_earned: 25, pr_url: null },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !profile) {
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

        {/* Profile Header */}
        <Card className="mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6" hover={false}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-google-blue to-blue-400 flex items-center justify-center flex-shrink-0 shadow-md">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
              : <User size={44} className="text-white" />
            }
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{profile.display_name}</h1>
            <p className="text-gray-500 mb-3 flex items-center justify-center sm:justify-start gap-1">
              <LinkIcon size={14} />
              <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                @{profile.github_username}
              </a>
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="px-4 py-1.5 bg-blue-50 text-google-blue rounded-full text-sm font-bold border border-blue-100">
                Level {profile.level}
              </span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold capitalize">
                {profile.tier}
              </span>
              <span className="px-4 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-bold border border-yellow-100">
                {profile.points} pts
              </span>
            </div>
          </div>
        </Card>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="space-y-6 lg:col-span-1">
            {profile && <LevelCard level={profile.level} tier={profile.tier} />}
            {stats && (
              <StatsOverview
                streak={stats.current_streak}
                issuesSolved={stats.total_issues_solved}
                challengesCompleted={stats.daily_challenges_completed}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:col-span-2">

            {/* Activity Heatmap */}
            <Card hover={false}>
              <ActivityHeatmap heatmap={stats?.heatmap || []} />
            </Card>

            {/* Badges */}
            <Card hover={false}>
              <BadgeShowcase badges={profile.badges || []} />
            </Card>

            {/* Contribution History */}
            <Card hover={false}>
              <ContributionList contributions={contributions} />
            </Card>

          </div>
        </div>

      </main>
    </div>
  );
}

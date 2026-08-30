import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import IssueInfo from '../components/issues/IssueInfo';
import GuidancePanel from '../components/issues/GuidancePanel';
import ChatWindow from '../components/issues/ChatWindow';
import Loader from '../components/common/Loader';
import { ArrowLeft } from 'lucide-react';
import api from '../config/api';

export default function IssueDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        // Simulate API or actual call
        try {
          const res = await api.get(`/issues/${id}`);
          setData(res.data);
        } catch (error) {
          console.log('Using mock issue detail data');
          // Mock data matching the api-contract.md
          setData({
            issue: {
              id: id,
              github_issue_id: 42,
              repo_full_name: 'freeCodeCamp/freeCodeCamp',
              title: 'Fix input validation in signup form',
              description: 'The signup form doesn\'t validate email format properly. Users can submit forms with invalid email addresses like "user@" or "user@.com".',
              url: 'https://github.com/freeCodeCamp/freeCodeCamp/issues/42',
              difficulty: 'beginner',
              difficulty_score: 22,
              required_skills: ['JavaScript', 'React', 'Regex'],
              labels: ['bug', 'good-first-issue'],
              points_reward: 10
            },
            guidance: {
              suggested_approach: [
                "Look at the signup form component in src/components/SignupForm.jsx",
                "The current validation only checks if the field is empty",
                "Consider using a regex pattern for email validation",
                "Test edge cases: missing domain, missing TLD, special characters"
              ],
              relevant_files: [
                "src/components/SignupForm.jsx",
                "src/utils/validators.js",
                "tests/SignupForm.test.js"
              ],
              concepts_to_review: [
                "Regular expressions for email validation",
                "React form handling"
              ],
              estimated_time: "30 min - 1 hour"
            }
          });
        }
      } catch (error) {
        console.error('Error fetching issue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  if (loading || !data) {
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
        
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Issue Info */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[600px]">
            <IssueInfo issue={data.issue} />
          </div>

          {/* Right Column - Guidance & Chat */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <div className="flex-1 min-h-[300px]">
              <GuidancePanel guidance={data.guidance} />
            </div>
            
            <div className="mt-auto">
              <ChatWindow issueId={id} />
            </div>
          </div>
          
        </div>

      </main>
    </div>
  );
}

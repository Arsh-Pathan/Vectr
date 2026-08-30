import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Sparkles, TrendingUp, Compass } from 'lucide-react';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-bg">
      <Navbar />
      
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight max-w-4xl mb-6">
          Find Your Next Open Source Contribution, <span className="text-google-blue">Intelligently.</span>
        </h1>
        <p className="text-xl text-text-secondary mb-12 max-w-2xl">
          AI-powered matching • Skill leveling • Guided learning
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          <GoogleLoginButton 
            onSuccess={() => navigate('/auth')} 
            text="Get Started" 
            className="text-lg px-8 py-4 shadow-md"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        <Card className="text-center p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-google-blue">
            <Compass size={32} />
          </div>
          <h3 className="text-xl font-bold mb-4">Smart Match</h3>
          <p className="text-text-secondary">Issues matched directly to your current skill level and preferred languages.</p>
        </Card>

        <Card className="text-center p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 text-google-green">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-xl font-bold mb-4">Level Up</h3>
          <p className="text-text-secondary">Track your growth from 0 to 99 as you solve issues and earn real open-source experience.</p>
        </Card>

        <Card className="text-center p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-6 text-google-yellow">
            <Sparkles size={32} />
          </div>
          <h3 className="text-xl font-bold mb-4">AI Guided</h3>
          <p className="text-text-secondary">Never gives you the answer, just guides you with approaches, files, and targeted hints.</p>
        </Card>
      </section>
    </div>
  );
}

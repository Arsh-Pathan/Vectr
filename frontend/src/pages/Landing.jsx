import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { Compass, TrendingUp, Sparkles, Github, Code, Target, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full">
        {/* --- 1. HERO SECTION --- */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Find Your Next Open Source<br className="hidden md:block" />
            Contribution, <span className="text-google-blue">Intelligently.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Vectr analyzes your GitHub profile to match you with the perfect issues. Level up your skills with AI-guided assistance, without ever getting the answer handed to you.
          </p>
          
          <div className="flex flex-col items-center space-y-4 mb-16">
            <GoogleLoginButton 
              onSuccess={() => navigate('/auth')} 
              text="Get Started" 
              className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
            />
            <p className="text-sm text-gray-400 font-medium">Free forever for open source contributors.</p>
          </div>

          {/* Hero App Mockup Placeholder */}
          <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden relative">
            <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="h-[400px] md:h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
              {/* Decorative elements for the mock */}
              <div className="absolute top-1/4 left-10 w-48 h-32 bg-white rounded-lg shadow-sm border border-gray-100 p-4 transform -rotate-6 hidden md:block">
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-3"></div>
                <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
              </div>
              <div className="absolute bottom-1/4 right-10 w-56 h-40 bg-white rounded-lg shadow-sm border border-gray-100 p-4 transform rotate-3 hidden md:block">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                   <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full h-16 bg-gray-50 rounded border border-gray-100"></div>
              </div>
              {/* Center badge */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4 text-google-blue">
                  <Sparkles size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">AI Match: 98%</h3>
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. HOW IT WORKS (Alternating Layout) --- */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold text-google-blue tracking-widest uppercase mb-3">How It Works</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Your path to mastering open source</h3>
            </div>

            {/* Step 1: Image Right */}
            <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-800 text-xl font-black">1</div>
                <h4 className="text-3xl font-bold text-gray-900">Connect your GitHub</h4>
                <p className="text-lg text-gray-600">
                  We analyze your public repositories, contributions, and top languages to build a comprehensive profile of your current skill level. No manual configuration required.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-gradient-to-tr from-gray-50 to-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center shadow-sm">
                  <Github size={64} className="text-gray-300" />
                </div>
              </div>
            </div>

            {/* Step 2: Image Left */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-24">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-blue-50 text-google-blue rounded-xl flex items-center justify-center text-xl font-black">2</div>
                <h4 className="text-3xl font-bold text-gray-900">Get intelligently matched</h4>
                <p className="text-lg text-gray-600">
                  Our algorithm scans thousands of open-source issues daily. We filter out the noise and only show you issues that perfectly match your tech stack and current difficulty level.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-gradient-to-tr from-blue-50 to-blue-100 rounded-2xl border border-blue-200 flex items-center justify-center shadow-sm relative overflow-hidden">
                   <div className="absolute -left-6 top-10 w-3/4 h-16 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm flex items-center px-4">
                     <div className="w-8 h-8 rounded bg-green-100 mr-3"></div>
                     <div className="flex-1 h-3 bg-gray-200 rounded"></div>
                   </div>
                   <div className="absolute right-4 bottom-12 w-2/3 h-20 bg-white/80 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm flex items-center px-4">
                     <div className="w-8 h-8 rounded bg-google-blue/20 mr-3"></div>
                     <div className="flex-1 space-y-2">
                       <div className="w-full h-3 bg-gray-200 rounded"></div>
                       <div className="w-1/2 h-3 bg-gray-100 rounded"></div>
                     </div>
                   </div>
                   <Target size={64} className="text-google-blue opacity-50" />
                </div>
              </div>
            </div>

            {/* Step 3: Image Right */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-black">3</div>
                <h4 className="text-3xl font-bold text-gray-900">Solve with AI Guidance</h4>
                <p className="text-lg text-gray-600">
                  Stuck on a problem? Chat with our Gemini-powered Guidance Agent. It reads the issue context and gives you structural hints, documentation links, and nudges — never just the raw code.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 flex items-center justify-center shadow-sm">
                  <Sparkles size={64} className="text-purple-300" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- 3. FEATURES GRID --- */}
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Everything you need to grow</h3>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">Vectr provides the perfect environment for continuous learning through real-world contributions.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-google-blue mb-6">
                  <Compass size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Smart Match</h4>
                <p className="text-gray-600">
                  Stop scrolling through GitHub. Get a curated feed of issues matched directly to your current proficiency and preferred languages.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6">
                  <TrendingUp size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Level Up</h4>
                <p className="text-gray-600">
                  Track your growth. Earn points for merged PRs, maintain daily contribution streaks, and unlock new tiers and badges.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 mb-6">
                  <Code size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Daily Challenges</h4>
                <p className="text-gray-600">
                  Build a habit. Every day, we hand-pick a specific challenge for you to solve to keep your problem-solving skills razor sharp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. BOTTOM CTA --- */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Ready to make an impact?</h2>
            <p className="text-xl text-gray-500 mb-10">
              Join thousands of developers who are leveling up their skills and improving open source projects around the world.
            </p>
            <GoogleLoginButton 
              onSuccess={() => navigate('/auth')} 
              text="Get Started Now" 
              className="text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all mx-auto"
            />
          </div>
        </section>
      </main>

      {/* --- 5. FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-google-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">V</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Vectr</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">How it Works</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Vectr. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

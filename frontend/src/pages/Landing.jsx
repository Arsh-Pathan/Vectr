import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import DecryptedText from '../components/animations/DecryptedText';
import PixelTransition from '../components/animations/PixelTransition';
import GlowingCard from '../components/animations/GlowingCard';
import { Compass, TrendingUp, Sparkles, Code, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleGetStarted = () => {
    navigate(token ? '/dashboard' : '/auth');
  };
  return (
    <div className="min-h-screen bg-primary-bg flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full">
        {/* --- 1. HERO SECTION --- */}
        <section className="relative pt-32 pb-24 w-full overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
          {/* Plain background now */}
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-[-10vh]">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left side: Text */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                  Experience liftoff with<br className="hidden sm:block" />
                  {' '}
                  Open Source
                  <br className="hidden md:block" />
                  Contributions,{' '}
                  <span className="text-google-blue inline-block">
                    Intelligently.
                  </span>
                </h1>
                
                <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 mt-12">
                  <button 
                    onClick={handleGetStarted}
                    className="text-base font-medium px-6 py-3 rounded-full bg-[#202124] text-white hover:bg-[#3c4043] shadow-none transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Right side: Logo */}
              <div className="flex-shrink-0 hidden lg:flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Vectr - Intelligent Matching. Guided Contributions." 
                  className="w-[400px] h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Hero App Mockup Placeholder */}
          <div className="w-full max-w-5xl mx-auto mt-16 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-2xl overflow-hidden relative z-10">
              <div className="h-10 bg-white/50 border-b border-gray-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="h-[400px] md:h-[600px] bg-gradient-to-br from-gray-50/50 to-gray-100/50 flex items-center justify-center relative overflow-hidden">
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
              <div className="flex-1 w-full relative">
                <PixelTransition
                  gridSize={12}
                  pixelColor="#4285F4"
                  animationStepDuration={0.4}
                  className="rounded-2xl border border-gray-200 shadow-sm"
                  aspectRatio="56.25%" /* aspect-video equivalent */
                  firstContent={
                    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </div>
                  }
                  secondContent={
                    <div className="w-full h-full bg-gradient-to-tr from-gray-800 to-gray-900 flex items-center justify-center">
                      <svg className="w-16 h-16 text-green-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <div className="absolute bottom-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Connected</div>
                    </div>
                  }
                />
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
              <div className="flex-1 w-full relative">
                <PixelTransition
                  gridSize={12}
                  pixelColor="#4285F4"
                  animationStepDuration={0.4}
                  className="rounded-2xl border border-blue-200 shadow-sm"
                  aspectRatio="56.25%"
                  firstContent={
                    <div className="w-full h-full bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
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
                  }
                  secondContent={
                    <div className="w-full h-full bg-gradient-to-tr from-google-blue to-blue-600 flex items-center justify-center relative overflow-hidden">
                       <Target size={96} className="text-white opacity-80" />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                          <span className="text-white font-bold text-2xl tracking-wide">Match Found</span>
                       </div>
                    </div>
                  }
                />
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
              <div className="flex-1 w-full relative">
                <PixelTransition
                  gridSize={12}
                  pixelColor="#4285F4"
                  animationStepDuration={0.4}
                  className="rounded-2xl border border-purple-100 shadow-sm"
                  aspectRatio="56.25%"
                  firstContent={
                    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                      <Sparkles size={64} className="text-purple-300" />
                    </div>
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#1e1e2e] flex flex-col items-center justify-center p-6 text-center">
                      <Sparkles size={32} className="text-purple-400 mb-2" />
                      <div className="w-3/4 h-3 bg-gray-600 rounded mb-2"></div>
                      <div className="w-1/2 h-3 bg-gray-700 rounded"></div>
                    </div>
                  }
                />
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
              <GlowingCard>
                <div className="bg-white p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-google-blue mb-6">
                    <Compass size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Smart Match</h4>
                  <p className="text-gray-600">
                    Stop scrolling through GitHub. Get a curated feed of issues matched directly to your current proficiency and preferred languages.
                  </p>
                </div>
              </GlowingCard>

              {/* Feature 2 */}
              <GlowingCard>
                <div className="bg-white p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6">
                    <TrendingUp size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Level Up</h4>
                  <p className="text-gray-600">
                    Track your growth. Earn points for merged PRs, maintain daily contribution streaks, and unlock new tiers and badges.
                  </p>
                </div>
              </GlowingCard>

              {/* Feature 3 */}
              <GlowingCard>
                <div className="bg-white p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 mb-6">
                    <Code size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Daily Challenges</h4>
                  <p className="text-gray-600">
                    Form a habit with curated bite-sized issues meant to be solved in under an hour to keep your streak alive.
                  </p>
                </div>
              </GlowingCard>
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
            <button 
              onClick={handleGetStarted}
              className="text-lg font-bold px-10 py-4 rounded-full bg-google-blue text-white shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all mx-auto flex items-center justify-center space-x-2"
            >
              <span>Get Started Now</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </main>

      {/* --- 5. FOOTER --- */}
      <footer className="bg-[#0f172a] text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            
            {/* Column 1: Brand & Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/logo.png" 
                  alt="Vectr Logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-white font-bold text-2xl tracking-tight">Vectr</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
                Vectr intelligently matches developers with open source issues based on their skill level, providing AI guidance to accelerate learning and open source contributions.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="text-white font-bold mb-5 tracking-wide">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-google-blue transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">AI Matchmaking</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">Daily Challenges</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">Leaderboards</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="text-white font-bold mb-5 tracking-wide">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-google-blue transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">Open Source Guide</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">Support API</a></li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div>
              <h4 className="text-white font-bold mb-5 tracking-wide">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-google-blue transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-google-blue transition-colors">Contact</a></li>
              </ul>
            </div>
            
          </div>
          
          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Vectr Inc. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Built with <span className="text-red-500 text-lg leading-none">♥</span> for open source.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

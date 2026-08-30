import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import GitHubConnectButton from '../components/auth/GitHubConnectButton';
import LanguageSelector from '../components/auth/LanguageSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [step, setStep] = useState(1);
  const [githubData, setGithubData] = useState(null);

  const handleGoogleSuccess = (data) => {
    if (data && data.access_token) {
      login(data.access_token);
    }
    setStep(2);
  };

  const handleGitHubSuccess = (data) => {
    setGithubData(data);
    setStep(3);
    
    // Auto-advance to language selection after level reveal animation
    setTimeout(() => {
      setStep(4);
    }, 4000);
  };

  const handleLanguageSubmit = (languages) => {
    console.log('Submitted languages:', languages);
    // Simulate API call to save preferences
    // api.post('/developer/preferences', { languages })
    setStep(5);
  };

  useEffect(() => {
    if (step === 5) {
      navigate('/dashboard');
    }
  }, [step, navigate]);

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg p-8 relative overflow-hidden" hover={false}>
          
          <div className="mb-8">
            {/* Simple progress indicator */}
            <div className="flex justify-between items-center px-4">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step >= s ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`w-16 h-1 mx-2 rounded-full ${
                      step > s ? 'bg-google-blue' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-[300px] flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold mb-4">Create your account</h2>
                  <p className="text-text-secondary mb-8">Sign in with Google to get started</p>
                  <GoogleLoginButton onSuccess={handleGoogleSuccess} className="w-full py-3" />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold mb-4">Connect GitHub</h2>
                  <p className="text-text-secondary mb-8">We use your GitHub profile to determine your initial skill level and find the perfect issues for you.</p>
                  <GitHubConnectButton onSuccess={handleGitHubSuccess} className="w-full" />
                </motion.div>
              )}

              {step === 3 && githubData && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="text-center flex flex-col items-center justify-center"
                >
                  <h2 className="text-2xl font-bold mb-6">Analyzing Profile...</h2>
                  
                  <motion.div 
                    initial={{ rotate: -90, strokeDasharray: "0, 100" }}
                    animate={{ rotate: 0, strokeDasharray: "100, 100" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative w-40 h-40 flex items-center justify-center mb-6"
                  >
                    <svg className="w-full h-full absolute inset-0 text-gray-200 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" />
                      <motion.circle 
                        cx="50" cy="50" r="45" fill="none" stroke="#4285F4" strokeWidth="10" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: githubData.level / 100 }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                      />
                    </svg>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.5 }}
                      className="text-center z-10"
                    >
                      <div className="text-sm text-text-secondary uppercase font-bold tracking-widest mb-1">Level</div>
                      <div className="text-5xl font-bold text-gray-900">{githubData.level}</div>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                  >
                    <span className="px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-sm uppercase">
                      {githubData.tier}
                    </span>
                    <p className="mt-4 text-text-secondary">Profile analyzed! Setting things up...</p>
                  </motion.div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <LanguageSelector onSubmit={handleLanguageSubmit} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </main>
    </div>
  );
}

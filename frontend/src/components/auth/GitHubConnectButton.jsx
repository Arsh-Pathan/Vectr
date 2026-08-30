import React from 'react';
import { Github } from 'lucide-react';

export default function GitHubConnectButton({ onSuccess, className = "" }) {
  const handleConnect = async () => {
    try {
      console.log('Simulating GitHub connect...');
      await new Promise(res => setTimeout(res, 1500));
      
      // We would call:
      // const response = await api.post('/auth/github/connect', { code: 'mock_code' });
      
      if (onSuccess) {
        // Pass mock profile analysis as per API contract
        onSuccess({
          level: 18,
          tier: 'beginner',
          points: 350
        });
      }
    } catch (error) {
      console.error('GitHub connect failed:', error);
    }
  };

  return (
    <button
      onClick={handleConnect}
      className={`flex items-center justify-center space-x-3 bg-[#24292F] text-white font-medium py-3 px-6 rounded-full hover:bg-[#1F2328] transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-[#24292F] ${className}`}
    >
      <Github className="w-5 h-5" />
      <span>Connect GitHub Account</span>
    </button>
  );
}

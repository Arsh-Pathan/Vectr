import React from 'react';

export default function GlowingCard({ children, className = '' }) {
  return (
    <div className={`relative group rounded-2xl p-[3px] overflow-hidden ${className}`}>
      {/* Spotlight glow behind the card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-google-blue via-purple-500 to-google-red rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      {/* Spinning border container (needs to be larger to avoid corner clipping when rotating) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-spin-slow z-0">
        {/* Conic gradient for the spinning border */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#4285F4_360deg)] opacity-70"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg,transparent_0_340deg,#EA4335_360deg)] opacity-70"></div>
      </div>
      
      {/* Inner Content */}
      <div className="relative h-full w-full bg-white rounded-xl overflow-hidden z-10 shadow-inner">
        {children}
      </div>
    </div>
  );
}

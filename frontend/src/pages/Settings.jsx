import React from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="flex items-center space-x-6">
              <img 
                src={user?.avatar_url || "https://github.com/identicons/vectr.png"} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border border-gray-200"
              />
              <div>
                <p className="text-lg font-medium text-gray-900">{user?.name || user?.github_username || 'Developer'}</p>
                <p className="text-sm text-gray-500">Connected via GitHub</p>
                <button className="mt-2 text-sm text-google-blue hover:text-blue-700 font-medium">
                  Update Profile Picture
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive updates about new matched issues.</p>
                </div>
                <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-offset-2">
                  <span aria-hidden="true" className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Toggle dark theme for the dashboard.</p>
                </div>
                <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-offset-2">
                  <span aria-hidden="true" className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-red-50">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

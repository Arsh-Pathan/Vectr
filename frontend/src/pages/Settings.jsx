import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import LanguageSelector from '../components/auth/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLanguageUpdate = async (languages) => {
    try {
      await api.post('/developer/preferences', { languages });
      toast.success('Languages updated successfully!');
      setIsLangModalOpen(false);
    } catch (err) {
      toast.error('Failed to update languages.');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/auth/account');
      toast.success('Account deleted successfully.');
      logout();
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete account.');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
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
                <button 
                  onClick={() => toast('Profile picture syncs from GitHub automatically.', { icon: 'ℹ️' })}
                  className="mt-2 text-sm text-google-blue hover:text-blue-700 font-medium"
                >
                  Update Profile Picture
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Developer Profile</h2>
              <Button variant="secondary" onClick={() => setIsLangModalOpen(true)}>Edit Languages</Button>
            </div>
            <p className="text-sm text-gray-600">Update your preferred programming languages and frameworks to get better issue recommendations.</p>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive updates about new matched issues.</p>
                </div>
                <button 
                  onClick={() => setEmailNotifs(!emailNotifs)}
                  className={`${emailNotifs ? 'bg-google-blue' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                >
                  <span className={`${emailNotifs ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Toggle dark theme for the dashboard.</p>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`${darkMode ? 'bg-gray-900' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                >
                  <span className={`${darkMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-red-50">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>

      {/* Language Edit Modal */}
      <Modal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} title="Update Preferences">
        <LanguageSelector onSubmit={handleLanguageUpdate} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Account">
        <div className="p-2">
          <p className="text-gray-700 mb-6">Are you sure you want to permanently delete your account? All your progress, points, and badges will be lost. This cannot be undone.</p>
          <div className="flex gap-4">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

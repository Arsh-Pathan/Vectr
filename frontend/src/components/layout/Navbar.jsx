import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
          Vectr
        </Link>
        {token && (
          <div className="hidden md:flex space-x-6 text-sm font-medium text-text-secondary">
            <Link to="/dashboard" className="hover:text-google-blue transition-colors">Dashboard</Link>
            <Link to="/issues" className="hover:text-google-blue transition-colors">Issues</Link>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {token ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <img 
                src={user?.avatar_url || "https://github.com/identicons/vectr.png"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Developer'}</p>
                </div>
                <Link 
                  to="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={16} className="mr-2 text-gray-400" />
                  Your Profile
                </Link>
                <Link 
                  to="/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings size={16} className="mr-2 text-gray-400" />
                  Settings
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="text-sm font-medium px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

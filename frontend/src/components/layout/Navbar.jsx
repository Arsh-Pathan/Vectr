import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
          Vectr
        </Link>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-text-secondary">
          <Link to="/dashboard" className="hover:text-google-blue transition-colors">Dashboard</Link>
          <Link to="/issues" className="hover:text-google-blue transition-colors">Issues</Link>
          <Link to="/profile" className="hover:text-google-blue transition-colors">Profile</Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {token || user ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-google-blue transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-google-blue">
                <User size={16} />
              </div>
              <span className="hidden sm:inline-block">{user?.name || 'Developer'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-50"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="text-sm font-medium text-google-blue hover:text-blue-700 transition-colors">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

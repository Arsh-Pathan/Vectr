import { Link } from 'react-router-dom';

export default function Navbar() {
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
        {/* Placeholder for Auth Context usage later */}
        <Link to="/auth" className="text-sm font-medium text-google-blue hover:text-blue-700 transition-colors">
          Sign In
        </Link>
      </div>
    </nav>
  );
}

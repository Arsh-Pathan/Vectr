import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import OrgRegister from './pages/OrgRegister';
import DailyChallenge from './pages/DailyChallenge';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
          <Route path="/issue/:id" element={<ProtectedRoute><IssueDetail /></ProtectedRoute>} />
          <Route path="/org" element={<ProtectedRoute><OrgRegister /></ProtectedRoute>} />
          <Route path="/daily" element={<ProtectedRoute><DailyChallenge /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

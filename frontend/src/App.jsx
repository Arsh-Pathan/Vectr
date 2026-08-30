import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import IssueDetail from './pages/IssueDetail';
import OrgRegister from './pages/OrgRegister';
import DailyChallenge from './pages/DailyChallenge';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/issue/:id" element={<IssueDetail />} />
        <Route path="/org" element={<OrgRegister />} />
        <Route path="/daily" element={<DailyChallenge />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/dashboard'; 
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel'; 
import AdminMembers from './pages/Adminmembers'; // Import the new Member Management page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/members" element={<AdminMembers />} /> {/* Added route */}
      </Routes>
    </Router>
  );
}

export default App;
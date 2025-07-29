import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Blogs from './pages/Blogs';
import Testimonials from './pages/Testimonials';
import FAQSettings from './pages/FAQSettings';
import Upload from './pages/Upload';
import CreateAdmin from './pages/CreateAdmin';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HeaderSettings from './pages/HeaderSettings';
import PortfolioSettings from './pages/PortfolioSettings';
import './index.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setAuthed(!!localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      {authed ? (
        <div className="min-h-screen flex">
          {/* Sidebar - left */}
          <div className="hidden md:block">
            <Sidebar open={true} onClose={() => {}} />
          </div>
          {/* Mobile Sidebar - toggleable (optional, can be added later) */}
          {/* Main area */}
          <div className="flex-1 flex flex-col min-h-screen">
            <Navbar setAuthed={setAuthed} />
            <main className="flex-1">
              <Routes>
                <Route path="/login" element={<Login setAuthed={setAuthed} />} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
                <Route path="/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
                <Route path="/testimonials" element={<PrivateRoute><Testimonials /></PrivateRoute>} />
                <Route path="/faq" element={<PrivateRoute><FAQSettings /></PrivateRoute>} />
                <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
                <Route path="/createadmin" element={<PrivateRoute><CreateAdmin token={localStorage.getItem('token')} /></PrivateRoute>} />
                <Route path="/headersettings" element={<PrivateRoute><HeaderSettings /></PrivateRoute>} />
                <Route path="/portfolio" element={<PrivateRoute><PortfolioSettings /></PrivateRoute>} />
                <Route path="*" element={<Navigate to={authed ? "/" : "/login"} />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setAuthed={setAuthed} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

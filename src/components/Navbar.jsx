import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Navbar({ setAuthed }) {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthed(false);
    navigate('/login');
  };
  return (
    <nav className="bg-[#0f172a] py-4 px-8 flex items-center justify-between shadow-md relative">
      {/* Mobile: Hamburger + Logo only */}
      <div className="flex items-center md:hidden">
        <button
          className="text-3xl text-cyan-400 focus:outline-none mr-3"
          onClick={() => setShowSidebar(true)}
          aria-label="Open menu"
        >
          <span>&#9776;</span>
        </button>
        <span className="text-xl font-bold text-cyan-400">Admin Dashboard</span>
        <Sidebar open={showSidebar} onClose={() => setShowSidebar(false)} />
      </div>
      {/* Desktop: Logo and menu links */}
      <>
        <span className="hidden md:inline text-xl font-bold text-cyan-400">Admin Dashboard</span>
        <div className="hidden md:flex gap-6 items-center">
          <button onClick={handleLogout} className="ml-6 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:scale-105 transition">Logout</button>
        </div>
      </>
    </nav>
  );
}

import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay and sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] shadow-xl z-50 transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-cyan-700">
          <span className="text-2xl font-extrabold text-cyan-400 tracking-wide">Admin Panel</span>
          {/* Close button only on mobile */}
          <button
            className="text-2xl text-cyan-400 focus:outline-none md:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col gap-4 px-8 py-8 text-white text-lg font-medium">
          <Link to="/" className="hover:text-cyan-400" onClick={onClose}>Dashboard</Link>
          <Link to="/headersettings" className="hover:text-cyan-400" onClick={onClose}>Header Settings</Link>
          <Link to="/services" className="hover:text-cyan-400" onClick={onClose}>Services</Link>
          <Link to="/portfolio" className="hover:text-cyan-400" onClick={onClose}>Portfolio</Link>
          <Link to="/blogs" className="hover:text-cyan-400" onClick={onClose}>Blogs</Link>
          <Link to="/faq" className="hover:text-cyan-400" onClick={onClose}>FAQ</Link>
          <Link to="/upload" className="hover:text-cyan-400" onClick={onClose}>Upload</Link>
          <Link to="/createadmin" className="hover:text-cyan-400" onClick={onClose}>Create Admin</Link>
        </nav>
      </aside>
    </>
  );
}

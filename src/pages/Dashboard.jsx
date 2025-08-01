import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

import Sidebar from '../components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import CreateAdmin from './CreateAdmin';
ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({ services: 0, blogs: 0, testimonials: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/analytics/dashboard`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-white">Loading dashboard...</div>;

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]">

      {/* Mobile Sidebar only */}
      <div className="md:hidden">
        <Sidebar />
      </div>
      {/* Dashboard Content */}
      <main>
        <h2 className="text-3xl font-extrabold text-primary mb-1 pt-4 pl-4 font-serif tracking-tight">Dashboard Analytics</h2>
        <div className="w-16 h-1 ml-4 mb-8 rounded-full bg-gradient-to-r from-gold via-gold/80 to-gold/40"></div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 w-full">
          <div className="bg-cyan-500/90 rounded-xl shadow-lg p-4 flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-white">{stats.services}</span>
            <span className="text-white mt-1 font-semibold">Services</span>
          </div>
          <div className="bg-pink-500/90 rounded-xl shadow-lg p-4 flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-white">{stats.blogs}</span>
            <span className="text-white mt-1 font-semibold">Blogs</span>
          </div>
          <div className="bg-yellow-400/90 rounded-xl shadow-lg p-4 flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-white">{stats.testimonials}</span>
            <span className="text-white mt-1 font-semibold">Testimonials</span>
          </div>
          <div className="bg-violet-500/90 rounded-xl shadow-lg p-4 flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-white">{stats.admins}</span>
            <span className="text-white mt-1 font-semibold">Admins</span>
          </div>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-[#1e293b]/90 rounded-2xl p-4 md:p-6 shadow-xl">
            <Bar
                data={{
                  labels: ['Services', 'Blogs', 'Testimonials', 'Admins'],
                  datasets: [{
                    label: 'Count',
                    data: [stats.services, stats.blogs, stats.testimonials, stats.admins],
                    backgroundColor: [
                      'rgba(6,182,212,0.7)',
                      'rgba(236,72,153,0.7)',
                      'rgba(250,204,21,0.7)',
                      'rgba(139,92,246,0.7)'
                    ]
                  }]
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </div>
            <div className="bg-[#1e293b]/90 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col items-center justify-center">
              <Pie
                data={{
                  labels: ['Services', 'Blogs', 'Testimonials', 'Admins'],
                  datasets: [{
                    data: [stats.services, stats.blogs, stats.testimonials, stats.admins],
                    backgroundColor: [
                      'rgba(6,182,212,0.7)',
                      'rgba(236,72,153,0.7)',
                      'rgba(250,204,21,0.7)',
                      'rgba(139,92,246,0.7)'
                    ]
                  }]
                }}
                options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>
          </div>
        </main>
    </div>
  );
}

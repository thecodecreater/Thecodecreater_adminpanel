import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setAuthed }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      setAuthed(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <form onSubmit={handleSubmit} className="bg-[#1e293b]/90 rounded-2xl p-8 shadow-xl flex flex-col gap-6 w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-white">Admin Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-cyan-400/30 focus:border-cyan-400 outline-none transition-all"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-cyan-400/30 focus:border-cyan-400 outline-none transition-all"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-xl hover:scale-105 hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 text-lg"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="text-red-400 text-center mt-2 font-semibold">{error}</div>}
      </form>
    </div>
  );
}

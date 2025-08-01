import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: '', content: '', avatar: '', rating: 5 });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchTestimonials = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(setTestimonials);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ image: reader.result })
      });
      const data = await res.json();
      setForm(f => ({ ...f, avatar: data.url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/testimonials/${editing}` : '/api/testimonials';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMsg(editing ? 'Testimonial updated!' : 'Testimonial added!');
      setForm({ name: '', content: '', avatar: '', rating: 5 });
      setEditing(null);
      fetchTestimonials();
    } else {
      setMsg('Error!');
    }
  };

  const handleEdit = t => {
    setEditing(t._id);
    setForm({ name: t.name, content: t.content, avatar: t.avatar || '', rating: t.rating || 5 });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this testimonial?')) return;
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      setMsg('Testimonial deleted!');
      fetchTestimonials();
    } else {
      setMsg('Error!');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Manage Testimonials</h2>
      <form onSubmit={handleSubmit} className="bg-[#1e293b]/90 rounded-2xl p-6 shadow-xl flex flex-col gap-4 max-w-xl mb-10">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-yellow-400/30 focus:border-yellow-400 outline-none transition-all" />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Testimonial" required rows={3} className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-yellow-400/30 focus:border-yellow-400 outline-none transition-all" />
        <input type="file" accept="image/*" onChange={handleImage} className="rounded-lg px-4 py-3 bg-[#0f172a] text-white" />
        {form.avatar && <img src={form.avatar} alt="Avatar" className="w-20 h-20 object-cover rounded-full border mt-2" />}
        <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} placeholder="Rating (1-5)" required className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-yellow-400/30 focus:border-yellow-400 outline-none transition-all" />
        <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300 text-lg">{editing ? 'Update' : 'Add'} Testimonial</button>
        {msg && <p className="text-yellow-400">{msg}</p>}
      </form>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map(t => (
          <motion.div key={t._id} className="bg-[#1e293b]/80 rounded-2xl p-6 shadow-xl flex flex-col gap-2 relative group" whileHover={{ scale: 1.03 }}>
            <img src={t.avatar || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=200&q=80'} alt="Avatar" className="w-20 h-20 object-cover rounded-full border mb-2" />
            <div className="text-lg font-bold text-white">{t.name}</div>
            <div className="text-slate-300">{t.content}</div>
            <div className="flex gap-1 mt-2">
              {[...Array(Number(t.rating) || 5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(t)} className="px-4 py-1 rounded-full bg-yellow-400 text-white font-bold hover:bg-yellow-600 transition">Edit</button>
              <button onClick={() => handleDelete(t._id)} className="px-4 py-1 rounded-full bg-pink-500 text-white font-bold hover:bg-pink-700 transition">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

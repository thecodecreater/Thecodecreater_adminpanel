import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', icon: '', image: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/services`);
      console.log('Services API response status:', response.status);
      const data = await response.json();
      console.log('Fetched services data:', data);
      setServices(data);
      console.log('Services state updated');
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
 

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ image: reader.result })
      });
      const data = await res.json();
      setForm(f => ({ ...f, image: data.url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Form data:', form);
    const method = editing ? 'PUT' : 'POST';
    const endpoint = editing ? `/api/services/${editing}` : '/api/services';
    const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
    console.log('Making request to:', url);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(form)
      });
      
      console.log('Response status:', res.status);
      const responseData = await res.json().catch(e => ({}));
      console.log('Response data:', responseData);
      
      if (res.ok) {
        setMsg(editing ? 'Service updated!' : 'Service added!');
        setForm({ title: '', description: '', icon: '', image: '' });
        setEditing(null);
        fetchServices();
      } else {
        setMsg(`Error: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      setMsg(`Network Error: ${error.message}`);
    }
  };

  const handleEdit = srv => {
    setEditing(srv._id);
    setForm({ title: srv.title, description: srv.description, icon: srv.icon || '', image: srv.image || '' });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this service?')) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/services/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    });
    if (res.ok) {
      setMsg('Service deleted!');
      fetchServices();
    } else {
      setMsg('Error!');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Manage Services</h2>
      <form onSubmit={handleSubmit} className="bg-[#1e293b]/90 rounded-2xl p-6 shadow-xl flex flex-col gap-4 max-w-xl mb-10">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-cyan-400/30 focus:border-cyan-400 outline-none transition-all" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required rows={3} className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-cyan-400/30 focus:border-cyan-400 outline-none transition-all" />
        <input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (optional)" className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-cyan-400/30 focus:border-cyan-400 outline-none transition-all" />
        <input type="file" accept="image/*" onChange={handleImage} className="rounded-lg px-4 py-3 bg-[#0f172a] text-white" />
        {form.image && <img src={form.image} alt="Service" className="w-32 h-20 object-cover rounded-lg border mt-2" />}
        <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300 text-lg">{editing ? 'Update' : 'Add'} Service</button>
        {msg && <p className="text-cyan-400">{msg}</p>}
      </form>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(srv => (
          <motion.div key={srv._id} className="bg-[#172554]/80 rounded-2xl p-6 shadow-xl flex flex-col gap-2 relative group" whileHover={{ scale: 1.03 }}>
            <img src={srv.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'} alt="Service" className="w-full h-32 object-cover rounded-lg mb-2" />
            <div className="text-lg font-bold text-white">{srv.title}</div>
            <div className="text-slate-300">{srv.description}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(srv)} className="px-4 py-1 rounded-full bg-cyan-500 text-white font-bold hover:bg-cyan-700 transition">Edit</button>
              <button onClick={() => handleDelete(srv._id)} className="px-4 py-1 rounded-full bg-pink-500 text-white font-bold hover:bg-pink-700 transition">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

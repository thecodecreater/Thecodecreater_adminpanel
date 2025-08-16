import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', image: '', author: '', tags: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchBlogs = () => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/blogs`)
      .then(res => res.json())
      .then(setBlogs);
  };

  useEffect(() => {
    fetchBlogs();
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
      setForm(f => ({ ...f, image: data.url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const url = editing ? `${baseUrl}/api/blogs/${editing}` : `${baseUrl}/api/blogs`;
    const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ ...form, tags: tagsArr })
    });
    if (res.ok) {
      setMsg(editing ? 'Blog updated!' : 'Blog added!');
      setForm({ title: '', content: '', image: '', author: '', tags: '' });
      setEditing(null);
      fetchBlogs();
    } else {
      setMsg('Error!');
    }
  };

  const handleEdit = blog => {
    setEditing(blog._id);
    setForm({ title: blog.title, content: blog.content, image: blog.image || '', author: blog.author || '', tags: blog.tags?.join(', ') || '' });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this blog?')) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      setMsg('Blog deleted!');
      fetchBlogs();
    } else {
      setMsg('Error!');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Manage Blogs</h2>
      <form onSubmit={handleSubmit} className="bg-[#1e293b]/90 rounded-2xl p-6 shadow-xl flex flex-col gap-4 max-w-xl mb-10">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-pink-400/30 focus:border-pink-400 outline-none transition-all" />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required rows={5} className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-pink-400/30 focus:border-pink-400 outline-none transition-all" />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author (optional)" className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-pink-400/30 focus:border-pink-400 outline-none transition-all" />
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="rounded-lg px-4 py-3 bg-[#0f172a] text-white placeholder:text-slate-400 border border-pink-400/30 focus:border-pink-400 outline-none transition-all" />
        <input type="file" accept="image/*" onChange={handleImage} className="rounded-lg px-4 py-3 bg-[#0f172a] text-white" />
        {form.image && <img src={form.image} alt="Blog" className="w-32 h-20 object-cover rounded-lg border mt-2" />}
        <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300 text-lg">{editing ? 'Update' : 'Add'} Blog</button>
        {msg && <p className="text-pink-400">{msg}</p>}
      </form>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map(blog => (
          <motion.div key={blog._id} className="bg-[#1e293b]/80 rounded-2xl p-6 shadow-xl flex flex-col gap-2 relative group" whileHover={{ scale: 1.03 }}>
            <img src={blog.image || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80'} alt="Blog" className="w-full h-32 object-cover rounded-lg mb-2" />
            <div className="text-lg font-bold text-white">{blog.title}</div>
            <div className="text-slate-300 line-clamp-2">{blog.content}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(blog)} className="px-4 py-1 rounded-full bg-pink-500 text-white font-bold hover:bg-pink-700 transition">Edit</button>
              <button onClick={() => handleDelete(blog._id)} className="px-4 py-1 rounded-full bg-cyan-500 text-white font-bold hover:bg-cyan-700 transition">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

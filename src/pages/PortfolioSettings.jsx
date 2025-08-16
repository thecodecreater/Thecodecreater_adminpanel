import React, { useState, useEffect } from 'react';
import axios from 'axios';

const emptyProject = { title: '', description: '', image: '', link: '', tags: '' };

export default function PortfolioSettings() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/portfolio`);
      setProjects(res.data);
    } catch {
      setMessage('Failed to fetch projects');
    }
    setLoading(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/portfolio/${editingId}`, {
          ...project,
          tags: project.tags.split(',').map(t => t.trim()).filter(Boolean)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Project updated!');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/portfolio`, {
          ...project,
          tags: project.tags.split(',').map(t => t.trim()).filter(Boolean)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Project added!');
      }
      setProject(emptyProject);
      setEditingId(null);
      fetchProjects();
    } catch {
      setMessage('Save failed');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleEdit = p => {
    setProject({ ...p, tags: (p.tags || []).join(', ') });
    setEditingId(p._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this project?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Project deleted!');
      fetchProjects();
    } catch {
      setMessage('Delete failed');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1e293b] p-8 rounded-2xl mt-12 shadow-2xl">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Manage Portfolio</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input name="title" value={project.title} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-[#0f172a] text-white border border-gray-700" placeholder="Title" required />
        <textarea name="description" value={project.description} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-[#0f172a] text-white border border-gray-700" placeholder="Description" required />
        <div>
          <label className="block mb-1 text-slate-300">Project Image</label>
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = async () => {
              setLoading(true);
              try {
                const token = localStorage.getItem('token');
                const res = await axios.post(
                  `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/upload`,
                  { image: reader.result },
                  { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                );
                setProject(prev => ({ ...prev, image: res.data.url || res.data.image || '' }));
                setMessage('Image uploaded!');
              } catch {
                setMessage('Image upload failed');
              }
              setLoading(false);
              setTimeout(() => setMessage(''), 2000);
            };
            reader.readAsDataURL(file);
          }} className="w-full px-4 py-2 rounded-xl bg-[#0f172a] text-white border border-gray-700" />
          {project.image && (
            <img src={project.image} alt="preview" className="w-40 h-24 object-cover rounded-xl border border-gray-700 mt-2" />
          )}
        </div>
        <input name="link" value={project.link} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-[#0f172a] text-white border border-gray-700" placeholder="Project Link (optional)" />
        <input name="tags" value={project.tags} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-[#0f172a] text-white border border-gray-700" placeholder="Tags (comma separated)" />
        <button type="submit" className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold mt-2 disabled:opacity-60" disabled={loading}>{editingId ? 'Update' : 'Add'} Project</button>
        {message && <div className="text-center text-cyan-400 font-semibold mt-2">{message}</div>}
      </form>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">All Projects</h3>
        {loading ? <div className="text-slate-400">Loading...</div> : (
          <ul className="space-y-4">
            {projects.map(p => (
              <li key={p._id} className="bg-[#172554]/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-cyan-400">{p.title}</div>
                  <div className="text-slate-200 text-sm mb-1">{p.description}</div>
                  {p.tags && p.tags.length > 0 && (
                    <div className="text-xs text-slate-400">Tags: {p.tags.join(', ')}</div>
                  )}
                  {p.link && <a href={p.link} className="text-xs text-blue-400 underline" target="_blank" rel="noopener noreferrer">Visit</a>}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {p.image && <img src={p.image} alt={p.title} className="w-20 h-14 object-cover rounded-lg border border-gray-700" />}
                  <button onClick={() => handleEdit(p)} className="px-3 py-1 text-xs rounded-lg bg-cyan-700 text-white hover:bg-cyan-500">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="px-3 py-1 text-xs rounded-lg bg-red-700 text-white hover:bg-red-500">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

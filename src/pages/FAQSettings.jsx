import React, { useEffect, useState } from 'react';

const API_URL = `${process.env.REACT_APP_API_URL}/api/faqs`;

export default function FAQSettings() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch all FAQs
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      setError('Failed to fetch FAQs');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Open modal for add/edit
  const openModal = (faq = null) => {
    setEditFaq(faq);
    setForm(faq ? { question: faq.question, answer: faq.answer } : { question: '', answer: '' });
    setModalOpen(true);
  };

  // Handle form change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save FAQ (add or edit)
  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const method = editFaq ? 'PUT' : 'POST';
      const url = editFaq ? `${API_URL}/${editFaq._id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to save FAQ');
      setModalOpen(false);
      fetchFaqs();
    } catch (err) {
      setError('Failed to save FAQ');
    }
    setSaving(false);
  };

  // Delete FAQ
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchFaqs();
    } catch (err) {
      setError('Failed to delete FAQ');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => openModal()}
        >
          + Add FAQ
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {faqs.length === 0 && <div className="text-gray-400">No FAQs found.</div>}
          {faqs.map(faq => (
            <div key={faq._id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-lg text-gray-800">{faq.question}</div>
                <div className="text-gray-600 mt-1">{faq.answer}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  onClick={() => openModal(faq)}
                >Edit</button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(faq._id)}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Add/Edit FAQ */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-extrabold mb-4 text-center text-black drop-shadow-lg">{editFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block font-medium mb-1 text-black">Question</label>
                <input
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  required
                  className="w-full border-none rounded-lg px-4 py-2 bg-white/80 text-black shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                  placeholder="Enter your question"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-black">Answer</label>
                <textarea
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border-none rounded-lg px-4 py-2 bg-white/80 text-black shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                  placeholder="Enter the answer"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-cyan-700 transition w-full"
                disabled={saving}
              >
                {saving ? 'Saving...' : (editFaq ? 'Update FAQ' : 'Add FAQ')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
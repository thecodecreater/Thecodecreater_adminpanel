import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/header`;

const emptyMenuItem = { label: '', link: '' };

export default function HeaderSettings() {
  const [header, setHeader] = useState({
    logo: '',
    heading: '',
    paragraph: '',
    buttonText: '',
    buttonLink: '',
    button2Text: '',
    button2Link: '',
    menuItems: [emptyMenuItem]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    // Fetch existing header data
    axios.get(API_URL)
      .then(res => {
        if (res.data) {
          const data = res.data;
          // Always have at least one menu item
          if (!data.menuItems || !Array.isArray(data.menuItems) || data.menuItems.length === 0) {
            data.menuItems = [emptyMenuItem];
          }
          setHeader({
            logo: data.logo || '',
            heading: data.heading || '',
            paragraph: data.paragraph || '',
            buttonText: data.buttonText || '',
            buttonLink: data.buttonLink || '',
            button2Text: data.button2Text || '',
            button2Link: data.button2Link || '',
            menuItems: data.menuItems
          });
          // Set preview if logo is image (base64 or url)
          if (data.logo && (data.logo.startsWith('data:image') || data.logo.match(/\.(jpg|jpeg|png|gif|svg)$/i))) {
            setLogoPreview(data.logo);
          } else {
            setLogoPreview('');
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = e => {
    setHeader({ ...header, [e.target.name]: e.target.value });
    if (e.target.name === 'logo') {
      // If logo is a URL to image, show preview
      if (e.target.value.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        setLogoPreview(e.target.value);
      } else {
        setLogoPreview('');
      }
    }
  };

  // Handle logo image file select
  const handleLogoFile = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeader({ ...header, logo: reader.result });
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuChange = (idx, field, value) => {
    const menuItems = header.menuItems.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setHeader({ ...header, menuItems });
  };

  const addMenuItem = () => {
    setHeader({ ...header, menuItems: [...header.menuItems, emptyMenuItem] });
  };

  const removeMenuItem = idx => {
    const menuItems = header.menuItems.filter((_, i) => i !== idx);
    setHeader({ ...header, menuItems });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Validation: menuItems must not have empty label or link
    const filteredMenuItems = header.menuItems.filter(item => item.label.trim() !== '' && item.link.trim() !== '');
    if (filteredMenuItems.length !== header.menuItems.length) {
      setLoading(false);
      setError('Menu items cannot have blank label or link. Please fill all fields or remove empty menu items.');
      return;
    }

    // Prepare header data with filtered menuItems
    const headerToSave = { ...header, menuItems: filteredMenuItems };
    try {
      await axios.post(API_URL, headerToSave, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setSuccess('Header updated successfully!');
      // Refetch latest data after save
      axios.get(API_URL)
        .then(res => {
          if (res.data) {
            const data = res.data;
            if (!data.menuItems || !Array.isArray(data.menuItems) || data.menuItems.length === 0) {
              data.menuItems = [emptyMenuItem];
            }
            setHeader({
              logo: data.logo || '',
              heading: data.heading || '',
              paragraph: data.paragraph || '',
              buttonText: data.buttonText || '',
              buttonLink: data.buttonLink || '',
              button2Text: data.button2Text || '',
              button2Link: data.button2Link || '',
              menuItems: data.menuItems
            });
          }
        });
    } catch (err) {
      // Show backend error if available
      if (err.response && err.response.data && err.response.data.error) {
        setError('Failed to update header: ' + err.response.data.error);
      } else {
        setError('Failed to update header.');
      }
    }
    setLoading(false);
    // Auto-hide success/error after 2 seconds
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl mt-8 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/90 backdrop-blur-md border border-cyan-900/30">
      <h2 className="text-2xl font-bold mb-4">Header Settings</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoFile}
        />
        {logoPreview && (
          <div className="mb-4 flex flex-col items-start">
            <span className="text-xs text-slate-400 mb-1">Logo Preview:</span>
            <img src={logoPreview} alt="Logo Preview" className="h-14 object-contain bg-white rounded shadow p-1 border border-gray-200" />
          </div>
        )}

        <label className="block mb-2 font-medium">Heading</label>
        <input type="text" name="heading" value={header.heading} onChange={handleChange} className="w-full px-4 py-2 mb-4 rounded-xl border border-gray-300 bg-[#1e293b]/70 text-white placeholder:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition" placeholder="Main heading for homepage" />

        <label className="block mb-2 font-medium">Paragraph</label>
        <textarea name="paragraph" value={header.paragraph} onChange={handleChange} className="w-full px-4 py-2 mb-4 rounded-xl border border-gray-300 bg-[#1e293b]/70 text-white placeholder:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition" placeholder="Short description or tagline" />

        <label className="block mb-2 font-medium">Button Text</label>
        <input type="text" name="buttonText" value={header.buttonText} onChange={handleChange} className="w-full px-4 py-2 mb-4 rounded-xl border border-gray-300 bg-[#1e293b]/70 text-white placeholder:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition" placeholder="Button text (e.g. Get Started)" />

        <label className="block mb-2 font-medium">Button Link</label>
        <input type="text" name="buttonLink" value={header.buttonLink} onChange={handleChange} className="w-full px-4 py-2 mb-4 rounded-xl border border-gray-300 bg-[#1e293b]/70 text-white placeholder:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition" placeholder="Button link (e.g. /contact)" />

        <label className="block mb-2 font-medium">Button 2 Text</label>
        <input type="text" name="button2Text" value={header.button2Text} onChange={handleChange} className="w-full px-4 py-2 mb-4 rounded-xl border border-gray-300 bg-[#1e293b]/70 text-white placeholder:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition" placeholder="Second button text (e.g. View Portfolio)" />

        <label className="block mb-2 font-medium">Button 2 Link</label>
        <input type="text" name="button2Link" value={header.button2Link} onChange={handleChange} className="w-full px-4 py-2 mb-4 rounded-xl border border-gray-300 bg-[#1e293b]/70 text-white placeholder:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition" placeholder="Second button link (e.g. /portfolio)" />

        <label className="block mb-2 font-medium mt-4">Menu Items</label>
        {header.menuItems.map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input type="text" placeholder="Label" value={item.label} onChange={e => handleMenuChange(idx, 'label', e.target.value)} className="border p-2 rounded-xl w-1/2 bg-[#1e293b]/70 text-white placeholder:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition" />
            <input type="text" placeholder="Link" value={item.link} onChange={e => handleMenuChange(idx, 'link', e.target.value)} className="border p-2 rounded-xl w-1/2 bg-[#1e293b]/70 text-white placeholder:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition" />
            <button type="button" onClick={() => removeMenuItem(idx)} className="text-red-500 font-bold px-2">X</button>
          </div>
        ))}
        <div className="flex flex-col gap-6">
          <button type="button" onClick={addMenuItem} className="bg-cyan-500 text-white px-3 py-1 rounded">Add Menu Item</button>
          <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:from-cyan-600 hover:to-blue-700 transition font-semibold" disabled={loading}>
            {loading ? 'Saving...' : 'Save Header'}
          </button>
        </div>
        {success && <p className="text-green-600 mt-2">{success}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}

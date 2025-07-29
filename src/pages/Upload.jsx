import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [msg, setMsg] = useState('');

  const handleFile = e => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ image: reader.result })
      });
      const data = await res.json();
      if (data.url) {
        setUrl(data.url);
        setMsg('Uploaded!');
      } else {
        setMsg('Error!');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Upload Image (Cloudinary)</h2>
      <input type="file" accept="image/*" onChange={handleFile} className="rounded-lg px-4 py-3 bg-[#0f172a] text-white mb-4" />
      <button onClick={handleUpload} className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300 text-lg">Upload</button>
      {url && <img src={url} alt="Uploaded" className="w-40 h-32 object-cover rounded-lg border mt-4" />}
      {msg && <p className="text-cyan-400 mt-2">{msg}</p>}
    </div>
  );
}

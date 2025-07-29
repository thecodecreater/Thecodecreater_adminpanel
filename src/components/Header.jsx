import Sidebar from './Sidebar';

export default function Header() {
  return (
    <header className="w-full bg-[#0f172a] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-2xl md:text-3xl font-extrabold text-cyan-400 tracking-wide drop-shadow-lg">
          Admin Panel
        </span>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-white font-medium text-lg">
          <a href="/" className="hover:text-cyan-400 transition">Dashboard</a>
          <a href="/services" className="hover:text-cyan-400 transition">Services</a>
          <a href="/blogs" className="hover:text-cyan-400 transition">Blogs</a>
          <a href="/testimonials" className="hover:text-cyan-400 transition">Testimonials</a>
          <a href="/admins" className="hover:text-cyan-400 transition">Admins</a>
        </nav>
        {/* Mobile Sidebar (only below md) */}
        <div className="flex items-center ml-2 md:hidden">
          <Sidebar />
        </div>
      </div>
    </header>
  );
}

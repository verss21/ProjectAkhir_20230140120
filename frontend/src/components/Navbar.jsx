import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="glass-card sticky top-6 z-50 mx-4 md:mx-auto max-w-7xl rounded-[2rem] border-white/5 bg-black/40 px-6 py-2 transition-all duration-500 backdrop-blur-3xl shadow-2xl">
      <div className="flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <Link to="/home" className="text-2xl font-black text-white tracking-tighter hover:neon-glow-cyan transition-all duration-300">
            Ani<span className="text-[var(--accent-cyan)]">List</span>
          </Link>
          <div className="hidden lg:block">
            <div className="flex items-center gap-1">
              <NavBtn to="/home" label="Browse" />
              <NavBtn to="/seasonal" label="Seasonal" />
              <NavBtn to="/top" label="Trending" />
              <NavBtn to="/terminal" label="Terminal" />
              <NavBtn to="/watchlist" label="Watchlist" />
              <NavBtn to="/favorites" label="Favorites" />
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-white/5 transition-all text-xl"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <Link to="/profile" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-purple)] p-[2px]">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-[10px] font-black uppercase overflow-hidden">
                <span className="text-white group-hover:scale-110 transition-transform">Me</span>
              </div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white/5 hover:bg-red-500/20 text-red-500 px-5 py-2 rounded-2xl text-[10px] font-black uppercase transition-all border border-red-500/10"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-xl">{isDarkMode ? '🌙' : '☀️'}</button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden py-4 border-t border-white/5 mt-2 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-1 px-4">
            <MobileLink to="/home" label="Browse" onClick={() => setIsOpen(false)} />
            <MobileLink to="/seasonal" label="Seasonal" onClick={() => setIsOpen(false)} />
            <MobileLink to="/top" label="Trending" onClick={() => setIsOpen(false)} />
            <MobileLink to="/terminal" label="Terminal" onClick={() => setIsOpen(false)} />
            <MobileLink to="/watchlist" label="Watchlist" onClick={() => setIsOpen(false)} />
            <MobileLink to="/history" label="History" onClick={() => setIsOpen(false)} />
            <MobileLink to="/favorites" label="Favorites" onClick={() => setIsOpen(false)} />
            <MobileLink to="/profile" label="Profile" onClick={() => setIsOpen(false)} />
            <button onClick={handleLogout} className="text-left py-3 text-red-500 font-black uppercase text-[10px] tracking-widest mt-2 border-t border-white/5 pt-4">Logout Signal</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavBtn = ({ to, label }) => (
  <Link
    to={to}
    className="px-4 py-2 rounded-2xl text-[11px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all tracking-widest"
  >
    {label}
  </Link>
);

const MobileLink = ({ to, label, onClick }) => (
  <Link to={to} onClick={onClick} className="py-3 px-4 text-gray-400 font-bold uppercase text-xs hover:text-white transition-colors">{label}</Link>
);

export default Navbar;
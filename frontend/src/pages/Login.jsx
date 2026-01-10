import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Jika sudah login, jangan biarkan kembali ke halaman login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/home');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });

      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || "Authentication Terminal Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="max-w-md w-full glass-morphism p-10 border-white/5 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent-cyan)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-cyan)]/20 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--accent-purple)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-purple)]/20 transition-all duration-700"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Anilist <span className="text-[var(--accent-cyan)]">Login</span></h2>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Establish Secure Connection</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity Vector</label>
              <input
                type="text"
                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-[var(--accent-cyan)]/50 focus:bg-white/10 outline-none transition-all text-sm font-bold text-white placeholder:text-gray-700"
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Cipher</label>
              <input
                type="password"
                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-[var(--accent-cyan)]/50 focus:bg-white/10 outline-none transition-all text-sm font-bold text-white placeholder:text-gray-700"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full h-14 bg-white/5 hover:bg-[var(--accent-cyan)] text-white hover:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-white/5 hover:border-transparent active:scale-[0.98]">
              Authorize Sequence
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
              No fragment detected?
              <Link to="/register" className="ml-2 text-[var(--accent-cyan)] hover:text-white transition-colors">Register Unit</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
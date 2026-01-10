import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default sebagai user
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        password,
        role: 'user'
      });
      alert(response.data.message);
      navigate('/login');
    } catch (err) {
      alert("Registration Error: " + (err.response?.data?.error || "Signal Interrupted"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="max-w-md w-full glass-morphism p-10 border-white/5 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent-purple)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-purple)]/20 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--accent-pink)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-pink)]/20 transition-all duration-700"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Anilist <span className="text-[var(--accent-purple)]">Register</span></h2>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Initialize New Unit</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity Vector</label>
              <input
                type="text"
                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-[var(--accent-purple)]/50 focus:bg-white/10 outline-none transition-all text-sm font-bold text-white placeholder:text-gray-700"
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Cipher</label>
              <input
                type="password"
                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-[var(--accent-purple)]/50 focus:bg-white/10 outline-none transition-all text-sm font-bold text-white placeholder:text-gray-700"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full h-14 bg-white/5 hover:bg-[var(--accent-purple)] text-white hover:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-white/5 hover:border-transparent active:scale-[0.98]">
              Initialize Unit
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
              Already established?
              <Link to="/login" className="ml-2 text-[var(--accent-purple)] hover:text-white transition-colors">Access Anilist</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
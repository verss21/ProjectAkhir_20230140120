import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

const LocalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = "http://localhost:5001";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Ambil semua list lalu cari yang ID-nya cocok
        // Atau jika backend punya endpoint detail, gunakan itu
        const response = await axios.get('/api/admin/list');
        const allData = response.data.data || response.data;
        const found = allData.find(item => item.id.toString() === id);

        setAnime(found);
      } catch (err) {
        console.error("Gagal memuat detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.5em] animate-pulse">Rerouting Data...</p>
    </div>
  );

  if (!anime) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="text-6xl opacity-20">📡</div>
      <p className="text-red-500 font-black uppercase text-xs tracking-widest">Target Node Not Found</p>
      <button onClick={() => navigate(-1)} className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Return to Anilist</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="group mb-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all"
      >
        <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent-cyan)] group-hover:text-black transition-all">←</span>
        Go Back
      </button>

      <div className="glass-card p-0 rounded-[3rem] overflow-hidden border-white/5 flex flex-col lg:flex-row shadow-2xl">
        <div className="lg:w-96 flex-shrink-0 relative overflow-hidden">
          <img
            src={anime.image_url ? `${backendUrl}${anime.image_url}` : 'https://placehold.co/300x450'}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-black/20 to-black/80"></div>
        </div>

        <div className="p-8 lg:p-16 flex-grow relative">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="glass-card bg-cyan-500/10 py-1 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-[var(--accent-cyan)] border-cyan-500/20">
                Local Node
              </span>
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">
                {anime.category_name || "Uncategorized"}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">{anime.title}</h1>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-[var(--accent-cyan)]/30"></div>
              <h2 className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-[0.4em]">Protocol Summary</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              {anime.description || "No data fragments available for this node summary."}
            </p>
          </div>

          <div className="mt-16 absolute bottom-12 right-12 opacity-5 pointer-events-none">
            <span className="text-7xl font-black italic uppercase">LOCAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalDetail;
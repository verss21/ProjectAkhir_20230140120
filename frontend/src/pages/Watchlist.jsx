import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const res = await axios.get('/api/watchlist/list');
            setWatchlist(res.data.data);
        } catch (err) {
            console.error("Gagal load watchlist:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (mal_id) => {
        if (!window.confirm("Hapus dari watchlist?")) return;
        try {
            await axios.delete(`/api/watchlist/remove/${mal_id}`);
            setWatchlist(watchlist.filter(item => item.anime_mal_id !== mal_id));
        } catch (err) {
            alert("Gagal menghapus");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="w-12 h-12 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.5em] animate-pulse">Scanning Watchlist...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
            <div className="mb-12">
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-[var(--accent-cyan)]/10 flex items-center justify-center text-3xl shadow-2xl shadow-cyan-500/20 border border-[var(--accent-cyan)]/20">
                        🔖
                    </div>
                    Future Nodes
                </h1>
            </div>

            {watchlist.length === 0 ? (
                <div className="glass-morphism py-32 text-center group">
                    <div className="text-6xl mb-8 group-hover:scale-125 transition-transform duration-700 pointer-events-none opacity-20 group-hover:opacity-100">📡</div>
                    <p className="text-gray-500 font-black uppercase text-xs tracking-[0.4em] mb-8">No data clusters detected in this sector</p>
                    <Link to="/home" className="inline-flex items-center gap-4 bg-white/5 hover:bg-[var(--accent-cyan)] hover:text-black px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5 hover:border-transparent">
                        Start Transmission
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {watchlist.map((anime) => (
                        <div key={anime.id} className="group relative glass-card p-0 rounded-[2.5rem] overflow-hidden border-white/5 hover:border-[var(--accent-cyan)]/50 transition-all duration-700">
                            <Link to={`/anime/${anime.anime_mal_id}`}>
                                <div className="aspect-[3/4] relative overflow-hidden">
                                    <img src={anime.image_url} alt={anime.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-widest leading-none mb-1">Entry Confirmed</p>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="glass-card bg-black/60 py-1 px-3 rounded-xl text-[8px] font-black uppercase tracking-widest text-white/50 border-white/10 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
                                            {anime.type || 'TV'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <div className="p-5">
                                <h3 className="text-[11px] font-black uppercase tracking-tight truncate mb-4 text-gray-300 group-hover:text-white transition-colors">{anime.title}</h3>
                                <button
                                    onClick={() => handleRemove(anime.anime_mal_id)}
                                    className="w-full h-10 rounded-xl bg-white/3 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 hover:border-red-500/30"
                                >
                                    Erase Node
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;

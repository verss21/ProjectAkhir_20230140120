import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fetchWithRetry from '../utils/jikanApi';
import { Link } from 'react-router-dom';

const TopAnime = () => {
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(''); // tv, movie, owa, airing, upcoming

    useEffect(() => {
        fetchTop();
    }, [filter]);

    const fetchTop = async () => {
        setLoading(true);
        try {
            const url = filter ? `https://api.jikan.moe/v4/top/anime?filter=${filter}` : `https://api.jikan.moe/v4/top/anime`;
            const res = await fetchWithRetry(url);
            setAnimes(res.data.data);
        } catch (err) {
            console.error("Gagal load top anime:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="w-12 h-12 border-4 border-[var(--accent-pink)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-pink-500 tracking-[0.5em] animate-pulse">Ranking Entities...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-16 gap-8">
                <div>
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                        Elite <br /><span className="text-[var(--accent-pink)]">Rankings</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Filter Target: {filter || 'global_cluster'}</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    {['', 'airing', 'upcoming', 'tv', 'movie', 'ova'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border 
                              ${filter === f
                                    ? 'bg-[var(--accent-pink)] text-black border-transparent shadow-xl shadow-pink-500/20'
                                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-white'}`}
                        >
                            {f === '' ? 'All Sectors' : f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animes.map((anime, index) => (
                    <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`} className="group relative glass-card p-0 rounded-[2.5rem] overflow-hidden border-white/5 hover:border-[var(--accent-pink)]/50 transition-all duration-700">
                        <div className="flex h-40">
                            <div className="w-16 bg-black/40 flex items-center justify-center relative overflow-hidden">
                                <span className="text-2xl font-black text-white/10 group-hover:text-[var(--accent-pink)] transition-colors duration-500 z-10">
                                    {index + 1}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="w-28 h-40 flex-shrink-0 relative overflow-hidden">
                                <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="p-5 flex-grow flex flex-col justify-between overflow-hidden relative">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-white transition-colors mb-2">{anime.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-yellow-500 neon-glow-pink">★ {anime.score}</span>
                                        <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest">{anime.type}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {anime.genres?.slice(0, 2).map(g => (
                                        <span key={g.name} className="text-[7px] font-black uppercase tracking-widest text-gray-500 bg-white/3 px-2 py-1 rounded-lg border border-white/5">
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="absolute -bottom-2 -right-2 p-4 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none transform rotate-12 scale-150">
                                    <span className="text-4xl font-black italic">RANK</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TopAnime;

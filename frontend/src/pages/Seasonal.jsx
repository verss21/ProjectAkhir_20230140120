import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fetchWithRetry from '../utils/jikanApi';
import { Link } from 'react-router-dom';

const Seasonal = () => {
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [season, setSeason] = useState('winter');
    const [year, setYear] = useState(new Date().getFullYear());

    const seasons = ['winter', 'spring', 'summer', 'fall'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        fetchSeasonal();
    }, [season, year]);

    const fetchSeasonal = async () => {
        setLoading(true);
        try {
            const res = await fetchWithRetry(`https://api.jikan.moe/v4/seasons/${year}/${season}`);
            // Filter duplicates if any
            const uniqueAnimes = res.data.data.filter((anime, index, self) =>
                index === self.findIndex((t) => t.mal_id === anime.mal_id)
            );
            setAnimes(uniqueAnimes);
        } catch (err) {
            console.error("Gagal load seasonal anime:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="w-12 h-12 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.5em] animate-pulse">Fetching Seasonal Fragments...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-16 gap-8">
                <div>
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                        Seasonal <br /><span className="text-[var(--accent-cyan)]">Archive</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Current Vector: /{year}/{season}</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <select
                            value={season}
                            onChange={(e) => setSeason(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/5 hover:border-[var(--accent-cyan)]/50 px-8 py-4 rounded-3xl outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all pr-12"
                        >
                            {seasons.map(s => <option key={s} value={s} className="bg-gray-900 text-white">{s}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-xs opacity-30 group-hover:opacity-100 transition-opacity">▼</div>
                    </div>

                    <div className="relative group">
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/5 hover:border-[var(--accent-cyan)]/50 px-8 py-4 rounded-3xl outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all pr-12"
                        >
                            {years.map(y => <option key={y} value={y} className="bg-gray-900 text-white">{y}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-xs opacity-30 group-hover:opacity-100 transition-opacity">▼</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {animes.map((anime) => (
                    <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`} className="group relative glass-card p-0 rounded-[2.5rem] overflow-hidden border-white/5 hover:border-[var(--accent-cyan)]/50 transition-all duration-700">
                        <div className="aspect-[3/4] relative overflow-hidden">
                            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <p className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-widest leading-none mb-1">View Archive</p>
                            </div>
                            <div className="absolute top-4 left-4">
                                <div className="glass-card bg-black/60 py-1 px-3 rounded-xl border-white/10 group-hover:border-[var(--accent-cyan)]/30 transition-colors">
                                    <span className="text-[8px] font-black text-[var(--accent-cyan)] neon-glow-cyan">★ {anime.score || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-[11px] font-black uppercase tracking-tight truncate mb-2 text-gray-300 group-hover:text-white transition-colors">{anime.title}</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{anime.type}</span>
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{anime.episodes || '?'} Eps</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
                            <span className="text-4xl font-black italic">DISCOVERY</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Seasonal;

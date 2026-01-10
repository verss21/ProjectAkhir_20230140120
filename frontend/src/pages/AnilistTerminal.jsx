import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

const AnilistTerminal = () => {
    const [apiKey, setApiKey] = useState('');
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/auth/profile');
                setApiKey(res.data.user.api_key);
            } catch (err) {
                console.error("Gagal load profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleExecute = async () => {
        if (!apiKey) return alert("Hasilkan API Key Anda di profil terlebih dahulu!");
        setLoading(true);
        try {
            // Simulasi request external dengan header x-api-key
            const res = await axios.get('/api/auth/external/me', {
                headers: { 'x-api-key': apiKey }
            });
            setOutput(res.data);
        } catch (err) {
            setOutput({ error: "Access Denied", status: 403, message: "Invalid or missing API Key" });
        } finally {
            setLoading(false);
        }
    };

    const copyCurl = () => {
        const curl = `curl -X GET http://localhost:5001/api/auth/external/me \\
  -H "x-api-key: ${apiKey || 'YOUR_KEY_HERE'}"`;
        navigator.clipboard.writeText(curl);
        setCopySuccess('COPIED!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Anilist <span className="text-[var(--accent-cyan)]">Terminal</span></h1>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em]">Development Environment // Data Transmission Interface</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Controller */}
                <div className="lg:col-span-12 glass-morphism space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-black text-[var(--accent-cyan)] uppercase tracking-widest">Digital Signature Verification</h3>
                            <p className="text-gray-400 text-xs font-medium">Use your local API Key to establish a secure connection with the Anilist Grid.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-black/60 p-4 rounded-2xl border border-white/5 w-full md:w-auto">
                            <code className="text-[var(--accent-cyan)] font-mono text-xs">{apiKey || 'NO_KEY_DETECTED'}</code>
                            <button onClick={() => navigator.clipboard.writeText(apiKey)} className="text-white/20 hover:text-white transition-colors">📋</button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleExecute}
                            disabled={loading}
                            className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${loading ? 'bg-gray-800' : 'bg-[var(--accent-cyan)] text-black hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20'}`}
                        >
                            {loading ? 'Initializing...' : '▶ Execute Request'}
                        </button>
                        <button
                            onClick={copyCurl}
                            className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-white/5 text-white hover:bg-white/10 active:scale-95 border border-white/5 flex items-center gap-2"
                        >
                            <span>🐚</span> Copy cURL Resource {copySuccess && <span className="text-green-500 text-[8px] animate-pulse">({copySuccess})</span>}
                        </button>
                    </div>
                </div>

                {/* Formatted Display */}
                {output && output.success && (
                    <div className="lg:col-span-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-[var(--accent-purple)] uppercase tracking-[0.4em] flex items-center gap-2">
                                <span className="w-2 h-2 bg-[var(--accent-purple)] rounded-full animate-pulse"></span> Decoded Signal Topology
                            </h3>
                            <div className="px-4 py-1.5 bg-[var(--accent-purple)]/10 rounded-full border border-[var(--accent-purple)]/20">
                                <span className="text-[8px] font-black text-[var(--accent-purple)] uppercase tracking-widest">Protocol Version 4.0</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* User Identity */}
                            <div className="glass-morphism h-full p-8 border-t-2 border-t-[var(--accent-cyan)] flex flex-col items-center justify-center text-center group">
                                <div className="w-24 h-24 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-3xl mb-6 flex items-center justify-center text-4xl shadow-2xl shadow-cyan-500/20 transform group-hover:rotate-6 transition-transform">
                                    {output.data.user.username.charAt(0).toUpperCase()}
                                </div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{output.data.user.username}</h4>
                                <div className="px-4 py-1 bg-black/40 rounded-full border border-white/5">
                                    <p className="text-[8px] text-[var(--accent-cyan)] font-black uppercase tracking-widest">{output.data.user.role}</p>
                                </div>
                            </div>

                            {/* Data Clusters - Favorites & Watchlist */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Favorites Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h5 className="text-[9px] font-black text-white uppercase tracking-widest">Pulse Favorites <span className="text-gray-500 font-medium">({output.data.statistics.total_favorites})</span></h5>
                                        <span className="text-xs text-[var(--accent-pink)]">💠</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {output.data.favorites.map((fav, i) => (
                                            <div key={i} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-black/20">
                                                <img src={fav.image_url} alt={fav.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black to-transparent">
                                                    <p className="text-[7px] font-black text-white uppercase truncate line-clamp-1">{fav.title}</p>
                                                    <p className="text-[6px] text-gray-400 font-bold uppercase">{fav.type}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {Array.from({ length: Math.max(0, 5 - output.data.favorites.length) }).map((_, i) => (
                                            <div key={`empty-fav-${i}`} className="aspect-[3/4] rounded-xl border border-dashed border-white/5 bg-white/2 flex items-center justify-center">
                                                <span className="text-[8px] text-gray-700 font-black uppercase tracking-widest">Empty</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Watchlist Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h5 className="text-[9px] font-black text-white uppercase tracking-widest">Cluster Watchlist <span className="text-gray-500 font-medium">({output.data.statistics.total_watchlist})</span></h5>
                                        <span className="text-xs text-[var(--accent-purple)]">📡</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {output.data.watchlist.map((item, i) => (
                                            <div key={i} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-black/20">
                                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black to-transparent">
                                                    <p className="text-[7px] font-black text-white uppercase truncate line-clamp-1">{item.title}</p>
                                                    <p className="text-[6px] text-gray-400 font-bold uppercase">{item.type}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {Array.from({ length: Math.max(0, 5 - output.data.watchlist.length) }).map((_, i) => (
                                            <div key={`empty-watch-${i}`} className="aspect-[3/4] rounded-xl border border-dashed border-white/5 bg-white/2 flex items-center justify-center">
                                                <span className="text-[8px] text-gray-700 font-black uppercase tracking-widest">Empty</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {output && output.error && (
                    <div className="lg:col-span-12 p-8 glass-morphism border-red-500/20 bg-red-500/5 text-center">
                        <span className="text-4xl mb-4 block">🚫</span>
                        <h4 className="text-xl font-black text-red-400 uppercase tracking-tighter mb-2">{output.error}</h4>
                        <p className="text-gray-400 text-xs font-medium">{output.message || "Failed to establish a connection with the Anilist Grid."}</p>
                    </div>
                )}
            </div>


        </div>
    );
};



export default AnilistTerminal;

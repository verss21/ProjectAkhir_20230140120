import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Profile = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        favorites: 0,
        watchlist: 0,
        history: 0,
        avgRating: 0,
        ratingCount: 0,
        ratingDist: Array(10).fill(0)
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [profileRes, favRes, watchRes, histRes, ratRes] = await Promise.all([
                    axios.get('/api/auth/profile'),
                    axios.get('/api/favorites/list'),
                    axios.get('/api/watchlist/list'),
                    axios.get('/api/history/list'),
                    axios.get('/api/ratings/stats')
                ]);

                setUser(profileRes.data.user);
                setStats({
                    favorites: favRes.data.data.length,
                    watchlist: watchRes.data.data.length,
                    history: histRes.data.data.length,
                    avgRating: parseFloat(ratRes.data.stats.avgRating || 0).toFixed(1),
                    ratingCount: ratRes.data.stats.totalRatings,
                    ratingDist: ratRes.data.stats.distribution
                });
            } catch (err) {
                console.error("Gagal load profile data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);



    const handleGenerateKey = async () => {
        try {
            const res = await axios.post('/api/auth/generate-key');
            setUser({ ...user, api_key: res.data.api_key });
        } catch (err) {
            console.error("Gagal generate API key:", err);
        }
    };

    const copyToClipboard = () => {
        if (!user.api_key) return;
        navigator.clipboard.writeText(user.api_key);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="w-12 h-12 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-purple-500 tracking-[0.5em] animate-pulse">Syncing Profile Data...</p>
        </div>
    );
    if (!user) return <div className="text-center mt-20 text-red-500 font-black">UNABLE TO LOCATE USER ENTITY</div>;

    const pieData = {
        labels: ['Planning', 'Finished'],
        datasets: [{
            data: [stats.watchlist, stats.history],
            backgroundColor: ['rgba(0, 242, 255, 0.2)', 'rgba(188, 19, 254, 0.2)'],
            borderColor: ['var(--accent-cyan)', 'var(--accent-purple)'],
            borderWidth: 2,
            hoverOffset: 20
        }]
    };

    const barData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            label: 'Ratings',
            data: stats.ratingDist,
            backgroundColor: 'rgba(0, 242, 255, 0.3)',
            borderColor: 'var(--accent-cyan)',
            borderWidth: 2,
            borderRadius: 12,
            hoverBackgroundColor: 'var(--accent-cyan)'
        }]
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen space-y-8">
            {/* Header Bento Item */}
            <div className="glass-morphism relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-purple)]/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-700 group-hover:bg-[var(--accent-purple)]/10"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 mb-12">
                    <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-black shadow-2xl shadow-cyan-500/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black animate-pulse"></div>
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">{user.username}</h1>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6">User Level: Master Enthusiast</p>

                        <div className="inline-flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl group/api">
                            <div className="flex flex-col">
                                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-black mb-1">Secure API Link</span>
                                <code className="text-[var(--accent-cyan)] font-mono text-xs font-bold tracking-wider">{user.api_key || 'NO_KEY_DETECTED'}</code>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    to="/terminal"
                                    className="text-white/20 hover:text-[var(--accent-purple)] transition-colors text-lg"
                                    title="Open Terminal"
                                >
                                    📟
                                </Link>
                                <button
                                    onClick={copyToClipboard}
                                    className={`transition-colors text-lg ${user.api_key ? 'text-white/20 hover:text-white' : 'text-white/5 cursor-not-allowed'}`}
                                    title="Copy API Key"
                                >
                                    📋
                                </button>
                                <button
                                    onClick={handleGenerateKey}
                                    className="text-white/20 hover:text-[var(--accent-cyan)] transition-colors text-lg"
                                    title="Generate New Key"
                                >
                                    ⚡
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    <StatCard label="Anilist Favorites" value={stats.favorites} icon="💠" activeColor="text-[var(--accent-pink)] neon-glow-pink" />
                    <StatCard label="Future Clusters" value={stats.watchlist} icon="📡" activeColor="text-[var(--accent-cyan)] neon-glow-cyan" />
                    <StatCard label="Archive Data" value={stats.history} icon="📂" activeColor="text-[var(--accent-purple)] neon-glow-purple" />
                    <StatCard label="Sync Precision" value={stats.avgRating} subValue={`${stats.ratingCount} Evaluated`} icon="📈" activeColor="text-white" />
                </div>
            </div>

            {/* Charts Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12 glass-morphism">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-[0.4em] flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span> Evaluation Log Topology
                        </h3>
                    </div>
                    <div className="h-80 w-full">
                        <Bar
                            data={barData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                                        ticks: { color: '#4b5563', font: { weight: 'black', size: 10 } }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { color: '#9ca3af', font: { weight: 'black', size: 11 } }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="lg:col-span-12 glass-morphism">
                    <div className="flex flex-col md:flex-row items-center gap-12 py-6">
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                            <h3 className="text-[10px] font-black text-[var(--accent-purple)] uppercase tracking-[0.4em] mb-10">Sync Ratio</h3>
                            <div className="h-48 w-48 relative">
                                <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black text-white">{Math.round((stats.history / (stats.watchlist + stats.history || 1)) * 100)}%</span>
                                    <span className="text-[8px] font-black text-gray-500 uppercase">Efficiency</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <ChartInfo label="Archive Completed" value={stats.history} color="bg-[var(--accent-purple)]" />
                            <ChartInfo label="Signals Pending" value={stats.watchlist} color="bg-[var(--accent-cyan)]" />
                            <div className="md:col-span-2 p-6 bg-white/3 rounded-3xl border border-white/5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">System Diagnostics</p>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">Profile synchronization is currently optimal. Data fragments have been successfully archived across all sectors.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, subValue, icon, activeColor }) => (
    <div className="glass-card bg-white/2 hover:bg-white/5 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-500 border-white/5 hover:border-white/10 group active:scale-95">
        <span className="text-3xl mb-4 transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">{icon}</span>
        <span className={`text-3xl font-black text-white transition-all ${activeColor}`}>{value}</span>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mt-2 block w-full truncate px-2">{label}</span>
        {subValue && <span className="text-[8px] text-gray-600 font-bold uppercase mt-1">{subValue}</span>}
    </div>
);

const ChartInfo = ({ label, value, color }) => (
    <div className="flex items-center justify-between p-6 bg-white/3 rounded-3xl border border-white/5 transition-all hover:bg-white/5">
        <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${color} shadow-lg shadow-inherit animate-pulse`}></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-xl font-black text-white">{value}</span>
    </div>
);

export default Profile;

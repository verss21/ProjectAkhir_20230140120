import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig'; // Instance lokal dengan token
import axiosLib from 'axios';           // Tetap butuh untuk instansiasi jika perlu, tapi kita pakai utility
import fetchWithRetry from '../utils/jikanApi';
import { Link } from 'react-router-dom';

const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [sourceTitle, setSourceTitle] = useState('Trending Global');

  const [hasApiKey, setHasApiKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [checkingKey, setCheckingKey] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkUserKey();
      await fetchGenres();
      setTimeout(() => {
        fetchInitial(true);
      }, 500);
    };
    init();
  }, []);

  // Filter Genre Trigger
  useEffect(() => {
    if (!checkingKey && hasApiKey) {
      fetchInitial(true);
    }
  }, [genre]);

  const checkUserKey = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      if (res.data.user && res.data.user.api_key) {
        setHasApiKey(true);
      } else {
        setHasApiKey(false);
      }
    } catch (err) {
      console.error("Gagal cek user:", err);
    } finally {
      setCheckingKey(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetchWithRetry('https://api.jikan.moe/v4/genres/anime');
      setGenres(res.data.data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error("Gagal load genres:", err);
    }
  };

  const fetchInitial = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    const currentPage = reset ? 1 : page;
    try {
      let url = `https://api.jikan.moe/v4/top/anime?limit=18&page=${currentPage}`;
      if (genre) url = `https://api.jikan.moe/v4/anime?genres=${genre}&order_by=score&sort=desc&limit=18&page=${currentPage}`;

      const res = await fetchWithRetry(url);
      const newData = res.data.data;

      if (reset) {
        setAnimes(newData);
        setPage(2);
      } else {
        setAnimes(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
      }
      setHasMore(res.data.pagination.has_next_page);
    } catch (err) {
      if (err.response?.status === 429) {
        alert("Terlalu banyak permintaan ke Jikan API. Mohon tunggu sebentar.");
      }
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setGenre('');
      fetchInitial(true);
      setSourceTitle('Trending Global');
      return;
    }

    setLoading(true);
    setSourceTitle(`Hasil Pencarian: "${query}"`);
    try {
      const jikanRes = await fetchWithRetry(`https://api.jikan.moe/v4/anime?q=${query}&limit=24`);
      setAnimes(jikanRes.data.data);
      setHasMore(false);
    } catch (err) {
      console.error("Pencarian gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await axios.post('/api/auth/generate-key');
      setGeneratedKey(res.data.api_key);
      setHasApiKey(true);
    } catch (err) {
      alert("Gagal generate key!");
    }
  };

  // Infinite Scroll Trigger
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
        if (!loading && hasMore && !query) {
          fetchInitial();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, query, page]);

  if (checkingKey) return <div className="flex items-center justify-center min-h-screen text-blue-400 font-black animate-pulse">MEMERIKSA LAYANAN...</div>;

  const heroAnime = animes[0];

  return (
    <div className="py-8 px-4 max-w-[1600px] mx-auto min-h-screen">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-white/5 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">Discovery</h1>
            <p className="text-[10px] text-gray-500 font-black tracking-[0.3em] uppercase">{sourceTitle}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 w-full md:w-auto overflow-hidden">
          <div className="relative group flex-grow">
            <input
              type="text"
              placeholder="Magic, Space, Action..."
              className="w-full md:w-80 p-4 pl-12 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-[var(--accent-cyan)] transition-all text-sm font-medium placeholder:text-gray-600"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--accent-cyan)] transition-colors">🔍</span>
          </div>
          <select
            value={genre}
            onChange={(e) => { setGenre(e.target.value); setQuery(''); }}
            className="p-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-[var(--accent-purple)] transition-all text-xs font-black uppercase text-gray-400 appearance-none px-8 text-center cursor-pointer hover:bg-white/5"
          >
            <option value="">All Genres</option>
            {genres.map(g => <option key={g.mal_id} value={g.mal_id}>{g.name}</option>)}
          </select>
          <button type="submit" className="bg-[var(--accent-cyan)] hover:scale-105 active:scale-95 text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-cyan-500/10 transition-all uppercase text-xs tracking-widest">Explore</button>
        </form>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-auto-rows-[250px] gap-6 bento-container">
        {/* HERO ITEM */}
        {!query && heroAnime && (
          <Link
            to={`/anime/${heroAnime.mal_id}`}
            className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl transition-all duration-700 hover:border-cyan-500/50"
          >
            <img
              src={heroAnime.images.jpg.large_image_url}
              alt={heroAnime.title}
              className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute top-8 left-8">
              <span className="bg-cyan-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30">Hot Release</span>
            </div>
            <div className="absolute bottom-10 left-10 right-10">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-none uppercase tracking-tighter mb-4 group-hover:neon-glow-cyan transition-all">{heroAnime.title}</h2>
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
                <span className="text-yellow-500">⭐ {heroAnime.score}</span>
                <span>{heroAnime.type}</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-[10px]">{heroAnime.status}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Regular Bento Items */}
        {animes.slice(!query && heroAnime ? 1 : 0).map((anime, idx) => (
          <Link
            key={anime.mal_id}
            to={`/anime/${anime.mal_id}`}
            className={`group relative overflow-hidden rounded-[2.5rem] border border-white/5 glass-morphism p-0 hover:scale-[1.02] active:scale-95 transition-all duration-500 
              ${idx === 2 || idx === 5 ? 'md:row-span-2' : ''} 
              ${idx === 0 && query ? 'md:col-span-2 md:row-span-2' : ''}
            `}
          >
            <div className="h-full relative overflow-hidden">
              <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/40 to-transparent"></div>

              <div className="absolute top-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 w-10 h-10 rounded-2xl flex items-center justify-center text-lg">✨</div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  {anime.genres?.slice(0, 2).map(g => (
                    <span key={g.name} className="text-[8px] font-bold text-cyan-400 uppercase bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">{g.name}</span>
                  ))}
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-2">{anime.title}</h3>
                <div className="mt-2 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{anime.type}</span>
                  <span className="text-[10px] font-black text-yellow-500">★ {anime.score || 'N/A'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.5em] animate-pulse">Summoning Spirits...</p>
        </div>
      )}

      {!hasMore && !loading && !query && (
        <div className="text-center py-20">
          <p className="text-gray-600 uppercase font-black text-xs tracking-[0.3em]">End of the anime realm</p>
        </div>
      )}
    </div>
  );
};

export default Home;
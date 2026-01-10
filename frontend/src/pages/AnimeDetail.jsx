import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import axiosLocal from '../api/axiosConfig';
import fetchWithRetry from '../utils/jikanApi';

const AnimeDetail = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inHistory, setInHistory] = useState(false);
  const [epsWatched, setEpsWatched] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [recs, setRecs] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingWatch, setLoadingWatch] = useState(false);
  const [loadingHist, setLoadingHist] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchDetail();
    checkStatuses();
    fetchReviews();

    // Delay extra fetches to avoid Jikan 429 Rate Limit
    const timer = setTimeout(() => {
      fetchExtras();
    }, 1000);
    return () => clearTimeout(timer);
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}`);
      setAnime(res.data.data);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
    }
  };

  const fetchExtras = async () => {
    try {
      const [recsRes, charRes] = await Promise.all([
        fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/recommendations`).catch(() => ({ data: { data: [] } })),
        fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/characters`).catch(() => ({ data: { data: [] } }))
      ]);
      setRecs(recsRes.data.data.slice(0, 6));
      setCharacters(charRes.data.data.slice(0, 6));
    } catch (err) {
      console.error("Gagal load extras:", err);
    }
  };

  const checkStatuses = async () => {
    try {
      const [fav, watch, hist, rat] = await Promise.all([
        axiosLocal.get(`/api/favorites/check/${id}`),
        axiosLocal.get(`/api/watchlist/check/${id}`),
        axiosLocal.get(`/api/history/check/${id}`),
        axiosLocal.get(`/api/ratings/${id}`)
      ]);
      setIsFavorite(fav.data.isFavorite);
      setInWatchlist(watch.data.inWatchlist);
      setInHistory(hist.data.inHistory);
      if (hist.data.data) {
        setEpsWatched(hist.data.data.episodes_watched);
      }
      setUserRating(rat.data.rating);
    } catch (err) {
      console.error("Error cek status:", err);
    }
  };

  const updateEpisodeProgress = async (newCount) => {
    try {
      await axiosLocal.patch('/api/history/update-episode', {
        anime_mal_id: id,
        episodes_watched: newCount
      });
      setEpsWatched(newCount);
    } catch (err) {
      console.error("Gagal update progress:", err);
    }
  };

  const handleAddEpisode = () => {
    if (!anime) return;
    const next = epsWatched + 1;
    if (anime.episodes && next > anime.episodes) return;
    updateEpisodeProgress(next);
  };

  const handleSubEpisode = () => {
    const next = epsWatched - 1;
    if (next < 0) return;
    updateEpisodeProgress(next);
  };

  const fetchReviews = async () => {
    try {
      const res = await axiosLocal.get(`/api/reviews/${id}`);
      setReviews(res.data.data);
    } catch (err) {
      console.error("Error load reviews:", err);
    }
  };

  const toggleFavorite = async () => {
    if (!anime) return;
    setLoadingFav(true);
    try {
      if (isFavorite) {
        await axiosLocal.delete(`/api/favorites/remove/${id}`);
        setIsFavorite(false);
      } else {
        await axiosLocal.post('/api/favorites/add', {
          anime_mal_id: anime.mal_id,
          is_local: false,
          title: anime.title,
          image_url: anime.images.jpg.large_image_url,
          type: anime.type
        });
        setIsFavorite(true);
      }
    } catch (err) {
      alert("Gagal mengubah status favorit");
    } finally {
      setLoadingFav(false);
    }
  };

  const toggleWatchlist = async () => {
    setLoadingWatch(true);
    try {
      if (inWatchlist) {
        await axiosLocal.delete(`/api/watchlist/remove/${id}`);
        setInWatchlist(false);
      } else {
        await axiosLocal.post('/api/watchlist/add', {
          anime_mal_id: anime.mal_id,
          title: anime.title,
          image_url: anime.images.jpg.large_image_url,
          type: anime.type
        });
        setInWatchlist(true);
      }
    } catch (err) {
      alert("Gagal update watchlist");
    } finally {
      setLoadingWatch(false);
    }
  };

  const toggleHistory = async () => {
    setLoadingHist(true);
    try {
      if (inHistory) {
        await axiosLocal.delete(`/api/history/remove/${id}`);
        setInHistory(false);
      } else {
        await axiosLocal.post('/api/history/add', {
          anime_mal_id: anime.mal_id,
          title: anime.title,
          image_url: anime.images.jpg.large_image_url,
          type: anime.type,
          episodes_watched: anime.episodes,
          total_episodes: anime.episodes
        });
        setInHistory(true);
      }
    } catch (err) {
      alert("Gagal update riwayat");
    } finally {
      setLoadingHist(false);
    }
  };

  const handleRating = async (val) => {
    try {
      await axiosLocal.post('/api/ratings/add', { anime_mal_id: id, rating: val });
      setUserRating(val);
    } catch (err) {
      alert("Gagal menyimpan rating");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    setSubmittingReview(true);
    try {
      await axiosLocal.post('/api/reviews/add', { anime_mal_id: id, review_text: newReview });
      setNewReview('');
      fetchReviews();
    } catch (err) {
      alert("Gagal memposting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link tersalin ke clipboard!");
  };

  if (!anime) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.5em] animate-pulse">Tuning to Frequency...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 text-white max-w-7xl mx-auto min-h-screen">
      {/* Top Section: Breadcrumb & Title */}
      <div className="mb-10 animate-in fade-in slide-in-from-left duration-700">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
          <Link to="/home" className="hover:text-white transition-colors">Browse</Link>
          <span>/</span>
          <span className="text-[var(--accent-cyan)]">{anime.type}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter uppercase break-words">{anime.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-morphism p-0 overflow-hidden relative group rounded-[3rem]">
            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-auto object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
              <p className="text-xs font-medium text-gray-300 line-clamp-4">{anime.synopsis}</p>
            </div>
            <div className="absolute top-6 left-6">
              <div className="glass-card bg-black/40 px-4 py-2 rounded-2xl flex items-center gap-2 border-white/10">
                <span className="text-yellow-400">★</span>
                <span className="text-sm font-black">{anime.score || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="glass-morphism space-y-3">
            <div className="flex gap-3">
              <ActionBtn icon="❤️" active={isFavorite} onClick={toggleFavorite} loading={loadingFav} activeColor="bg-red-500" />
              <ActionBtn icon="🔖" active={inWatchlist} onClick={toggleWatchlist} loading={loadingWatch} activeColor="bg-yellow-500" />
              <ActionBtn icon="✅" active={inHistory} onClick={toggleHistory} loading={loadingHist} activeColor="bg-emerald-500" />
            </div>
            <button onClick={handleShare} className="w-full py-4 rounded-[1.5rem] bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
              <span>🔗</span> Copy Connection Link
            </button>
          </div>

          <div className="glass-morphism">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 text-center">Sync Rating</h3>
            <div className="flex justify-between items-center px-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`text-lg transition-all hover:scale-150 ${userRating >= star ? 'text-[var(--accent-cyan)] neon-glow-cyan' : 'text-white/10'}`}
                >
                  ●
                </button>
              ))}
            </div>
            {userRating > 0 && (
              <div className="mt-6 text-center">
                <span className="text-4xl font-black text-[var(--accent-cyan)]">{userRating}</span>
                <span className="text-gray-600 text-xs font-black ml-1">/ 10</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Progress Box (if in history) */}
          {inHistory && (
            <div className="glass-morphism bg-gradient-to-r from-[var(--accent-cyan)]/10 to-[var(--accent-purple)]/10 border-[var(--accent-cyan)]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-black/40 flex items-center justify-center text-3xl shadow-xl">📺</div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-[0.3em] mb-1">Personal Sync</p>
                    <h4 className="text-2xl font-black">Episode {epsWatched} <span className="text-gray-600">/ {anime.episodes || '?'}</span></h4>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ControlBtn icon="－" onClick={handleSubEpisode} />
                  <ControlBtn icon="＋" onClick={handleAddEpisode} highlight />
                </div>
              </div>
              <div className="mt-8 w-full h-2 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                  style={{ width: `${(epsWatched / (anime.episodes || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Info Grid (Bento Style) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <BentoInfo label="Status" value={anime.status} />
            <BentoInfo label="Format" value={anime.type} />
            <BentoInfo label="Aired" value={anime.aired.string} />
            <BentoInfo label="Episodes" value={anime.episodes || '??'} />
          </div>

          <div className="glass-morphism">
            <h3 className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <span className="w-1 h-1 bg-cyan-500 rounded-full"></span> Data Fragment
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm font-medium">{anime.synopsis}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-morphism p-6">
              <p className="text-[10px] font-black text-gray-500 uppercase mb-4">Studio</p>
              <p className="text-lg font-black">{anime.studios?.[0]?.name || '-'}</p>
            </div>
            <div className="glass-morphism p-6">
              <p className="text-[10px] font-black text-gray-500 uppercase mb-4">Source</p>
              <p className="text-lg font-black">{anime.source || '-'}</p>
            </div>
          </div>

          {/* Characters Fragment */}
          {characters.length > 0 && (
            <div className="glass-morphism">
              <h3 className="text-[10px] font-black text-[var(--accent-purple)] uppercase tracking-[0.3em] mb-8">Personnel Data</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {characters.map(char => (
                  <div key={char.character.mal_id} className="group flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 group-hover:border-[var(--accent-purple)]/50 transition-all duration-500 mb-3 shadow-xl">
                      <img src={char.character.images.jpg.image_url} alt={char.character.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <p className="text-[8px] font-black text-center truncate w-full uppercase text-gray-400 group-hover:text-white transition-colors">{char.character.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recs.length > 0 && (
            <div className="glass-morphism">
              <h3 className="text-[10px] font-black text-[var(--accent-pink)] uppercase tracking-[0.3em] mb-8">Related Clusters</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recs.map(item => (
                  <Link key={item.entry.mal_id} to={`/anime/${item.entry.mal_id}`} className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--accent-pink)]/50 transition-all">
                    <img src={item.entry.images.jpg.large_image_url} alt={item.entry.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-2">
                      <p className="text-[8px] font-black text-white truncate uppercase">{item.entry.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Fragment */}
          <div className="glass-morphism">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-[0.3em]">Communication Logs</h3>
              <span className="text-[9px] font-black bg-white/5 px-3 py-1 rounded-full">{reviews.length} Logs</span>
            </div>

            <form onSubmit={submitReview} className="mb-10 group">
              <textarea
                className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm text-white outline-none focus:border-[var(--accent-cyan)]/50 transition-all min-h-[120px] font-medium resize-none mb-4"
                placeholder="Insert transmission data..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              ></textarea>
              <div className="flex justify-end">
                <button
                  disabled={submittingReview}
                  className="bg-white/5 hover:bg-[var(--accent-cyan)] hover:text-black px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 hover:border-transparent active:scale-95"
                >
                  {submittingReview ? "Transmitting..." : "Send Log"}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="py-12 text-center text-gray-600 animate-pulse uppercase text-[10px] font-black tracking-widest">No logs detected in this sector</div>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className="p-6 bg-white/3 border border-white/5 rounded-3xl group hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center font-black text-[10px] text-black">
                          {rev.username?.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-black text-[var(--accent-cyan)] text-[10px] uppercase tracking-tighter">{rev.username}</p>
                      </div>
                      <p className="text-[8px] font-bold text-gray-600">{new Date(rev.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">{rev.review_text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({ icon, active, onClick, loading, activeColor }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`flex-grow h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 border border-white/5 
      ${active ? `${activeColor} bg-opacity-100 shadow-xl border-transparent` : 'bg-white/5 hover:bg-white/10'}`}
  >
    <span className={loading ? 'animate-spin' : ''}>{loading ? '⚙️' : icon}</span>
  </button>
);

const ControlBtn = ({ icon, onClick, highlight }) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all border border-white/5 
      ${highlight ? 'bg-[var(--accent-cyan)] text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 hover:bg-white/10 text-white'}`}
  >
    {icon}
  </button>
);

const BentoInfo = ({ label, value }) => (
  <div className="glass-morphism p-6 flex flex-col justify-center items-center text-center">
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{label}</p>
    <p className="font-black text-xs text-white uppercase truncate w-full">{value}</p>
  </div>
);

export default AnimeDetail;

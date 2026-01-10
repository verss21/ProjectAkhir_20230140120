import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Detail = () => {
  const { id } = useParams()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Kita langsung ambil dari Jikan API atau lewat Backend kamu
        // Jika lewat backend: http://localhost:5001/api/anime/${id}
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`)
        setAnime(res.data.data)
      } catch (err) {
        console.error("Gagal memuat detail:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading) return <div className="text-center mt-20 text-xl">Loading detail anime...</div>
  if (!anime) return <div className="text-center mt-20 text-red-500">Anime tidak ditemukan.</div>

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition"
      >
        ← Kembali
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Gambar Anime */}
        <div className="flex-shrink-0">
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            className="rounded-lg shadow-2xl w-full md:w-80 border-2 border-gray-700"
          />
        </div>

        {/* Informasi Anime */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 text-red-500">{anime.title}</h1>
          <h2 className="text-xl text-gray-400 mb-6 italic">{anime.title_japanese}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-400">Score</span>
              <span className="text-xl font-bold text-yellow-400">⭐ {anime.score || 'N/A'}</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-400">Rank</span>
              <span className="text-xl font-bold text-blue-400">#{anime.rank}</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-400">Episodes</span>
              <span className="text-xl font-bold text-green-400">{anime.episodes || '?'}</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-400">Status</span>
              <span className="text-sm font-bold">{anime.status}</span>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed text-justify">
              {anime.synopsis || "Tidak ada deskripsi tersedia untuk anime ini."}
            </p>
          </div>

          {/* Trailer */}
          {anime.trailer?.embed_url && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3 text-red-400">Trailer</h3>
              <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <iframe
                  width="100%"
                  height="400"
                  src={anime.trailer.embed_url}
                  title="Anime Trailer"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Detail
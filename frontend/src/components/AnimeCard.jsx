import { Link } from 'react-router-dom'

const AnimeCard = ({ anime }) => {
  return (
    <Link to={`/anime/${anime.id}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
        <img 
          src={anime.coverImage.large} 
          alt={anime.title.romaji} 
          className="w-full h-64 object-cover"
        />
        <div className="p-3">
          <h3 className="font-semibold text-sm truncate">{anime.title.romaji}</h3>
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard
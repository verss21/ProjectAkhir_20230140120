const { fetchFromJikan } = require('../services/jikanService');

const getPopularAnime = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await fetchFromJikan('/top/anime', {
            page,
            limit,
            filter: 'bypopularity'
        });

        // Mapping Jikan data ke format yang konsisten
        const formattedData = data.data.map(anime => ({
            id: anime.mal_id,
            title: {
                romaji: anime.title,
                english: anime.title_english
            },
            coverImage: {
                large: anime.images.jpg.large_image_url
            }
        }));

        res.status(200).json({
            success: true,
            data: {
                media: formattedData,
                pageInfo: {
                    currentPage: data.pagination.current_page,
                    hasNextPage: data.pagination.has_next_page
                }
            }
        });
    } catch (error) {
        console.error('Error in getPopularAnime:', error.message);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari Jikan API'
        });
    }
};

const getAnimeDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await fetchFromJikan(`/anime/${id}`);

        res.status(200).json({
            success: true,
            data: data.data
        });
    } catch (error) {
        console.error('Error Detail:', error.message);
        res.status(404).json({
            success: false,
            message: 'Anime tidak ditemukan di Jikan'
        });
    }
};

module.exports = {
    getPopularAnime,
    getAnimeDetail
};
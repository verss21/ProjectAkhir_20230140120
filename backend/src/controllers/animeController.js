const { fetchFromAniList } = require('../services/anilistService');
const { GET_POPULAR_ANIME, GET_ANIME_DETAIL } = require('../utils/queries');

const getPopularAnime = async (req, res) => {
    try {
        const { page = 1, perPage = 10 } = req.query;
        const variables = {
            page: parseInt(page),
            perPage: parseInt(perPage)
        };

        const data = await fetchFromAniList(GET_POPULAR_ANIME, variables);

        res.status(200).json({
            success: true,
            data: data.data.Page
        });
    } catch (error) {
        console.error('Error in getPopularAnime:', error.message);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari AniList'
        });
    }
};

const getAnimeDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const variables = { id: parseInt(id) };

        const data = await fetchFromAniList(GET_ANIME_DETAIL, variables);

        res.status(200).json({
            success: true,
            data: data.data // AniList mengembalikan { data: { Media: { ... } } }
        });
    } catch (error) {
        console.error('Error Detail:', error.message);
        res.status(404).json({
            success: false,
            message: 'Anime tidak ditemukan'
        });
    }
};

// HANYA GUNAKAN SATU module.exports DI AKHIR FILE
module.exports = {
    getPopularAnime,
    getAnimeDetail
};
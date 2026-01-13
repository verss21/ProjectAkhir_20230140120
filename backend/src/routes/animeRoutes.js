const express = require('express');
const router = express.Router();
const { getPopularAnime, getAnimeDetail } = require('../controllers/animeController');

router.get('/list', getPopularAnime);
router.get('/detail/:id', getAnimeDetail);

module.exports = router;
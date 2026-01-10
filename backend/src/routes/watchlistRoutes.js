const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { addToWatchlist, removeFromWatchlist, getWatchlist, checkWatchlistStatus } = require('../controllers/watchlistController');

router.post('/add', verifyToken, addToWatchlist);
router.delete('/remove/:mal_id', verifyToken, removeFromWatchlist);
router.get('/list', verifyToken, getWatchlist);
router.get('/check/:mal_id', verifyToken, checkWatchlistStatus);

module.exports = router;

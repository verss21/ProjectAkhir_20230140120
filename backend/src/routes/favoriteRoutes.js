const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // Pastikan path ini benar
const { addFavorite, removeFavorite, getFavorites, checkStatus } = require('../controllers/favoriteController');

// Semua route di bawah ini butuh login
router.post('/add', verifyToken, addFavorite);
router.delete('/remove/:mal_id', verifyToken, removeFavorite);
router.get('/list', verifyToken, getFavorites);
router.get('/check/:mal_id', verifyToken, checkStatus);

module.exports = router;

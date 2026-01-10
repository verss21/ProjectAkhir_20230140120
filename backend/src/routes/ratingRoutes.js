const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { addRating, getRating, getRatingStats } = require('../controllers/ratingController');

router.post('/add', verifyToken, addRating);
router.get('/stats', verifyToken, getRatingStats);
router.get('/:mal_id', verifyToken, getRating);

module.exports = router;

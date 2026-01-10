const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { addReview, getReviews, deleteReview } = require('../controllers/reviewController');

router.post('/add', verifyToken, addReview);
router.get('/:mal_id', getReviews); // Public can see reviews
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;

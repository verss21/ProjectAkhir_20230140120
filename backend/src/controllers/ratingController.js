const db = require('../config/db');

// Add or update rating
const addRating = async (req, res) => {
    const userId = req.user.id;
    const { anime_mal_id, rating } = req.body;

    if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ message: "Rating harus antara 1-10" });
    }

    try {
        await db.query(
            'INSERT INTO ratings (user_id, anime_mal_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
            [userId, anime_mal_id, rating, rating]
        );
        res.json({ success: true, message: "Rating berhasil disimpan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get user rating for an anime
const getRating = async (req, res) => {
    const userId = req.user.id;
    const { mal_id } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT rating FROM ratings WHERE user_id = ? AND anime_mal_id = ?',
            [userId, mal_id]
        );
        res.json({ rating: rows.length > 0 ? rows[0].rating : 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get user rating stats
const getRatingStats = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            'SELECT rating, COUNT(*) as count FROM ratings WHERE user_id = ? GROUP BY rating',
            [userId]
        );

        const [overall] = await db.query(
            'SELECT COUNT(*) as total, AVG(rating) as avgRating FROM ratings WHERE user_id = ?',
            [userId]
        );

        // Map distribution to an array of 10 values
        const distribution = Array(10).fill(0);
        rows.forEach(row => {
            distribution[row.rating - 1] = row.count;
        });

        res.json({
            success: true,
            stats: {
                totalRatings: overall[0].total,
                avgRating: overall[0].avgRating || 0,
                distribution: distribution
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { addRating, getRating, getRatingStats };

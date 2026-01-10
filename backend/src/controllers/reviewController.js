const db = require('../config/db');

const addReview = async (req, res) => {
    const userId = req.user.id;
    const { anime_mal_id, review_text } = req.body;
    const username = req.user.username; // Assuming username is in JWT

    if (!review_text) return res.status(400).json({ message: "Review cannot be empty" });

    try {
        await db.query(
            'INSERT INTO reviews (user_id, username, anime_mal_id, review_text) VALUES (?, ?, ?, ?)',
            [userId, username, anime_mal_id, review_text]
        );
        res.status(201).json({ success: true, message: "Review berhasil ditambahkan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const getReviews = async (req, res) => {
    const { mal_id } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM reviews WHERE anime_mal_id = ? ORDER BY created_at DESC',
            [mal_id]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const deleteReview = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM reviews WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        if (result.affectedRows === 0) return res.status(403).json({ message: "Gagal menghapus review" });
        res.json({ success: true, message: "Review berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { addReview, getReviews, deleteReview };

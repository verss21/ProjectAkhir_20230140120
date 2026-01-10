const db = require('../config/db');

const addToWatchlist = async (req, res) => {
    const userId = req.user.id;
    const { anime_mal_id, title, image_url, type } = req.body;

    try {
        await db.query(
            'INSERT INTO watchlist (user_id, anime_mal_id, title, image_url, type) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?',
            [userId, anime_mal_id, title, image_url, type, title]
        );
        res.status(201).json({ success: true, message: "Berhasil ditambahkan ke watchlist" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const removeFromWatchlist = async (req, res) => {
    const userId = req.user.id;
    const { mal_id } = req.params;

    try {
        await db.query(
            'DELETE FROM watchlist WHERE user_id = ? AND anime_mal_id = ?',
            [userId, mal_id]
        );
        res.json({ success: true, message: "Berhasil dihapus dari watchlist" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const getWatchlist = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            'SELECT * FROM watchlist WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const checkWatchlistStatus = async (req, res) => {
    const userId = req.user.id;
    const { mal_id } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM watchlist WHERE user_id = ? AND anime_mal_id = ?',
            [userId, mal_id]
        );
        res.json({ inWatchlist: rows.length > 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { addToWatchlist, removeFromWatchlist, getWatchlist, checkWatchlistStatus };

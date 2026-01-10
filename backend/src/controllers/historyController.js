const db = require('../config/db');

// Menambah ke riwayat (Watch History)
const addToHistory = async (req, res) => {
    const userId = req.user.id;
    const { anime_mal_id, title, image_url, type, episodes_watched } = req.body;

    try {
        await db.query(
            'INSERT INTO watch_history (user_id, anime_mal_id, title, image_url, type, episodes_watched) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE episodes_watched = ?',
            [userId, anime_mal_id, title, image_url, type, episodes_watched || 0, episodes_watched || 0]
        );
        res.status(201).json({ success: true, message: "Berhasil ditambahkan ke riwayat" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Menghapus dari riwayat
const removeFromHistory = async (req, res) => {
    const userId = req.user.id;
    const { mal_id } = req.params;

    try {
        await db.query(
            'DELETE FROM watch_history WHERE user_id = ? AND anime_mal_id = ?',
            [userId, mal_id]
        );
        res.json({ success: true, message: "Berhasil dihapus dari riwayat" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Mengambil daftar riwayat
const getHistory = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            'SELECT * FROM watch_history WHERE user_id = ? ORDER BY completed_at DESC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Mengecek status di riwayat
const checkHistoryStatus = async (req, res) => {
    const userId = req.user.id;
    const { mal_id } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM watch_history WHERE user_id = ? AND anime_mal_id = ?',
            [userId, mal_id]
        );
        res.json({ inHistory: rows.length > 0, data: rows[0] || null });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { addToHistory, removeFromHistory, getHistory, checkHistoryStatus };

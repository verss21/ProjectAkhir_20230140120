const db = require('../config/db');

// 1. TAMBAH KE FAVORIT
const addFavorite = async (req, res) => {
    const userId = req.user.id; // Dari middleware verifyToken
    const { anime_mal_id, is_local, title, image_url, type } = req.body;

    try {
        // Cek apakah sudah ada di favorit user ini
        const [existing] = await db.query(
            'SELECT * FROM favorites WHERE user_id = ? AND anime_mal_id = ?',
            [userId, anime_mal_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Anime ini sudah ada di favorit kamu!" });
        }

        await db.query(
            'INSERT INTO favorites (user_id, anime_mal_id, is_local, title, image_url, type) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, anime_mal_id, is_local, title, image_url, type]
        );

        res.status(201).json({ success: true, message: "Berhasil ditambahkan ke favorit" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. HAPUS DARI FAVORIT
const removeFavorite = async (req, res) => {
    const userId = req.user.id;
    const { mal_id } = req.params;

    try {
        await db.query(
            'DELETE FROM favorites WHERE user_id = ? AND anime_mal_id = ?',
            [userId, mal_id]
        );
        res.json({ success: true, message: "Berhasil dihapus dari favorit" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. LIHAT DAFTAR FAVORIT
const getFavorites = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. CEK STATUS FAVORIT (Untuk button di frontend)
const checkStatus = async (req, res) => {
    const userId = req.user.id;
    const { mal_id } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM favorites WHERE user_id = ? AND anime_mal_id = ?',
            [userId, mal_id]
        );
        res.json({ isFavorite: rows.length > 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { addFavorite, removeFavorite, getFavorites, checkStatus };

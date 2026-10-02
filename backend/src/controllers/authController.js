const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Untuk generate random string
const { fetchFromJikan } = require('../services/jikanService');

// 1. LOGIKA REGISTER
const register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "Username sudah digunakan" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role || 'user']
        );
        res.status(201).json({ success: true, message: "User berhasil didaftarkan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. LOGIKA LOGIN
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah" });
        }

        // Generate Token dengan payload lengkap
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'SECRET_KEY_BEBAS',
            { expiresIn: '1d' }
        );

        res.json({ success: true, token, role: user.role });
    } catch (err) {
        console.log("--- ERROR LOGIN ---");
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. LOGIKA LOGOUT
const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logout berhasil, sesi telah dihapus"
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. LOGIKA GET PROFILE (Tambahkan ini agar tidak error saat dipanggil Route)
const getProfile = async (req, res) => {
    try {
        // req.user didapat dari middleware verifyToken
        const [rows] = await db.query('SELECT id, username, role, api_key FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 5. GENERATE API KEY BARU
const generateApiKey = async (req, res) => {
    const userId = req.user.id;
    const newKey = 'ANI-' + crypto.randomBytes(8).toString('hex').toUpperCase(); // Contoh: ANI-1A2B3C4D

    try {
        await db.query('UPDATE users SET api_key = ? WHERE id = ?', [newKey, userId]);
        res.json({ success: true, api_key: newKey, message: "API Key berhasil dibuat!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 6. GET DATA UNTUK EXTERNAL API (SHOWCASE)
const getExternalProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [userData] = await db.query('SELECT id, username, role FROM users WHERE id = ?', [userId]);

        // Fetch top anime (data pas awal login)
        const animeData = await fetchFromJikan('/top/anime', { limit: 5 });

        res.json({
            success: true,
            status: "Connection Established",
            timestamp: new Date().toISOString(),
            data: {
                user: userData[0],
                anime_list: animeData.data.map(anime => ({
                    id: anime.mal_id,
                    title: anime.title,
                    image_url: anime.images.jpg.large_image_url,
                    score: anime.score
                }))
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// WAJIB EXPORT SEMUANYA
module.exports = { register, login, logout, getProfile, generateApiKey, getExternalProfile }; 

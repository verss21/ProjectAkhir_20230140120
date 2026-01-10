const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {
    // 1. Check for JWT in Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY_BEBAS');
            req.user = decoded;
            return next();
        } catch (err) {
            // If token is present but invalid, we don't necessarily fail yet if there's an API key
        }
    }

    // 2. Check for Static API Key in x-api-key header
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
        try {
            const [rows] = await db.query('SELECT id, username, role FROM users WHERE api_key = ?', [apiKey]);
            if (rows.length > 0) {
                req.user = { id: rows[0].id, username: rows[0].username, role: rows[0].role };
                return next();
            }
        } catch (err) {
            console.error("API Key Verification Error:", err);
        }
    }

    return res.status(403).json({ message: "Akses ditolak, token atau API key tidak valid" });
};

module.exports = { verifyToken };
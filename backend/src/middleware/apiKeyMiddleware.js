const db = require('../config/db');

const verifyApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ success: false, message: "API Key missing. Please provide 'x-api-key' header." });
    }

    try {
        const [rows] = await db.query('SELECT id, username FROM users WHERE api_key = ?', [apiKey]);
        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Invalid API Key." });
        }

        req.user = rows[0]; // Attach user data
        next();
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { verifyApiKey };

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(403).json({ message: "Akses ditolak, token tidak ada" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY_BEBAS');
        req.user = decoded; // Menyimpan data user (id, role) ke request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid" });
    }
};

module.exports = { verifyToken };
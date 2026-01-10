const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, generateApiKey, getExternalProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware'); // Wajib diimport untuk proteksi profil
const { verifyApiKey } = require('../middleware/apiKeyMiddleware'); // Middleware untuk API Key

// 1. Endpoint Publik (Bisa diakses tanpa login)
router.post('/register', register);
router.post('/login', login);

// 2. Endpoint Terproteksi (Wajib kirim Token di Header)
// Sesuai Poin C.1 di Dokumen Arsitektur
router.post('/logout', logout);
router.get('/profile', verifyToken, getProfile);
router.post('/generate-key', verifyToken, generateApiKey); // Route Generate Key
router.get('/external/me', verifyApiKey, getExternalProfile); // Route External via API Key

module.exports = router;
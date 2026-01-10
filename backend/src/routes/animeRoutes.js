const express = require('express');
const router = express.Router();
const { getAllAnimes, addAnime, deleteAnime } = require('../controllers/adminController');

router.get('/list', getAllAnimes);
router.post('/add', addAnime);
router.delete('/delete/:id', deleteAnime);

module.exports = router;
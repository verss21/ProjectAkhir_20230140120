const express = require('express');
const router = express.Router();
const { addToHistory, removeFromHistory, getHistory, checkHistoryStatus } = require('../controllers/historyController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/add', addToHistory);
router.delete('/remove/:mal_id', removeFromHistory);
router.get('/list', getHistory);
router.get('/status/:mal_id', checkHistoryStatus);

module.exports = router;

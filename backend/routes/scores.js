const express = require('express');
const router = express.Router();
const scoresController = require('../controllers/scoresController');

// ✅ ESTAS RUTAS DEBEN ESTAR EXACTAMENTE ASÍ
router.post('/save', scoresController.saveScore);
router.get('/mode/:modeId', scoresController.getScoresByMode); // ← ESTA ES LA IMPORTANTE
router.post('/rank', scoresController.getPlayerRank);
router.get('/leaderboard/:modeId', scoresController.getLeaderboard);

module.exports = router;
const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

router.get('/modes', questionsController.getGameModes);
router.get('/config', questionsController.getConfig);
router.get('/:modeId', questionsController.getQuestionsByMode);

module.exports = router;
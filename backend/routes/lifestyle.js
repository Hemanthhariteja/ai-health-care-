const express = require('express');
const router = express.Router();
const lifestyleController = require('../controllers/lifestyleController');

router.get('/diet', lifestyleController.getDiet);
router.get('/exercise', lifestyleController.getExercise);
router.get('/yoga', lifestyleController.getYoga);
router.get('/precautions', lifestyleController.getPrecautions);

module.exports = router;

const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { verifyUser } = require('../middleware/authMiddleware');

// GET user search history
router.get('/user', verifyUser, historyController.getSearchHistory);

// POST save search history
router.post('/save', verifyUser, historyController.saveSearchHistory);

module.exports = router;

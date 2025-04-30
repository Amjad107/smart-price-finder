const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { verifyUser } = require('../middleware/authMiddleware');

// ✅ Make sure this is a function
router.post('/text', searchController.searchByText);
router.post('/text', verifyUser, searchController.searchByText);

module.exports = router;

const express = require('express');
const { getUserDetails } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticateToken, getUserDetails); 
module.exports = router;

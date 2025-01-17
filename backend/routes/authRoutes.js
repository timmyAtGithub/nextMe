const express = require('express');
const { registerUser, loginUser, getCurrentUser, changePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/changePassword', authenticateToken, changePassword);


module.exports = router;

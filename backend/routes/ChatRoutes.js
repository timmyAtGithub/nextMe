const express = require('express');
const { getChats, getMessages, sendMessage } = require('../controllers/ChatController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticateToken, getChats); 
router.get('/:chatId/messages', authenticateToken, getMessages);
router.post('/messages', authenticateToken, sendMessage);

module.exports = router;

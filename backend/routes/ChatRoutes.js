const express = require('express');
const { getChats, getMessages, sendMessage, startChat, getChatDetails } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticateToken, getChats); 
router.get('/messages/:chatId', authenticateToken, getMessages);
router.post('/messages', authenticateToken, sendMessage);
router.post('/start', authenticateToken, startChat);
router.get('/details/:chatId', authenticateToken, getChatDetails);



module.exports = router;

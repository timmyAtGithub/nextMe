const express = require('express');
const { getChats, getMessages, sendMessage } = require('../controllers/ChatController');
const router = express.Router();

router.get('/:userId', getChats);
router.get('/messages/:chatId', getMessages); 
router.post('/messages', sendMessage); 

module.exports = router;

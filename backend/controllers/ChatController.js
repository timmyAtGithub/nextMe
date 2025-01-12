const pool = require('../server');

const getChats = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const result = await pool.query(
        `SELECT DISTINCT ON (c.id) 
          c.id, 
          CASE 
            WHEN c.user1_id = $1 THEN u2.username 
            ELSE u1.username 
          END AS friend_username,
          CASE 
            WHEN c.user1_id = $1 THEN u2.profile_image 
            ELSE u1.profile_image 
          END AS friend_profile_image,
          m.text AS lastMessage, 
          m.created_at AS lastMessageTime
         FROM chats c
         LEFT JOIN users u1 ON c.user1_id = u1.id
         LEFT JOIN users u2 ON c.user2_id = u2.id
         LEFT JOIN messages m ON c.id = m.chat_id
         WHERE c.user1_id = $1 OR c.user2_id = $1
         ORDER BY c.id, m.created_at DESC`,
        [userId]
      );
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching chats:', err.message);
      res.status(500).send('Server Error');
    }
  };
  

  const getMessages = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.id;

    try {
        const chatCheck = await pool.query(
            `SELECT * FROM chats WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
            [chatId, userId]
        );

        if (chatCheck.rows.length === 0) {
            return res.status(403).json({ message: 'Access denied: You are not a member of this chat' });
        }

        const result = await pool.query(
            `SELECT id, chat_id, sender_id, type, content, text, created_at FROM messages WHERE chat_id = $1 ORDER BY created_at ASC`,
            [chatId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No messages found for this chat' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching messages:', err.message);
        res.status(500).send('Server Error');
    }
};

  
const sendMessage = async (req, res) => {
    const { chatId, text } = req.body;
    const userId = req.user.id;
  
    console.log('Received data:', { chatId, text, userId }); 
  
    try {
      const result = await pool.query(
        `INSERT INTO messages (chat_id, sender_id, text) 
         VALUES ($1, $2, $3) RETURNING *`,
        [chatId, userId, text]
      );
  
      console.log('Message saved:', result.rows[0]); 
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error sending message:', err.message);
      res.status(500).send('Server Error');
    }
  };
  

const startChat = async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.id;

    try {
      const existingChat = await pool.query(
        `SELECT * FROM chats WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
        [userId, friendId]
      );

      if (existingChat.rows.length > 0) {
        return res.status(200).json({ id: existingChat.rows[0].id });
      }

      const newChat = await pool.query(
        `INSERT INTO chats (user1_id, user2_id) VALUES ($1, $2) RETURNING id`,
        [userId, friendId]
      );

      res.status(201).json({ id: newChat.rows[0].id });
    } catch (err) {
      console.error('Error starting chat:', err.message);
      res.status(500).send('Server Error');
    }
};
const getChatDetails = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.id;
  
    try {
      const result = await pool.query(
        `SELECT 
          CASE 
            WHEN c.user1_id = $1 THEN u2.username 
            ELSE u1.username 
          END AS friend_username,
          CASE 
            WHEN c.user1_id = $1 THEN u2.profile_image 
            ELSE u1.profile_image 
          END AS friend_profile_image
         FROM chats c
         JOIN users u1 ON c.user1_id = u1.id
         JOIN users u2 ON c.user2_id = u2.id
         WHERE c.id = $2 AND (c.user1_id = $1 OR c.user2_id = $1)`,
        [userId, chatId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Chat not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching chat details:', err.message);
      res.status(500).send('Server Error');
    }
  };

  const sendMedia = async (req, res) => {
    try {
      console.log("--- Upload Media Request Received ---");
      console.log("Headers:", req.headers);
      console.log("Request Body:", req.body);
  
      if (!req.file) {
        return res.status(400).json({ message: "No media uploaded" });
      }
  
      const chatId = parseInt(req.body.chatId, 10);
      if (isNaN(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }
  
      const senderId = req.user.id;
      const mediaPath = `http://localhost:5000/uploads/media/${req.file.filename}`;
      console.log("Chat ID:", chatId);
      console.log("Sender ID:", senderId);
      console.log("Media Path:", mediaPath);
  
      await pool.query(
        'INSERT INTO messages (chat_id, sender_id, type, text, content) VALUES ($1, $2, $3, $4, $5)',
        [chatId, senderId, 'media', '[Media]', mediaPath]
      );
  
      res.json({ message: "Media sent successfully", mediaPath });
    } catch (err) {
      console.error("Error uploading media:", err);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  

module.exports = { getChats, getMessages, sendMessage, startChat, getChatDetails, sendMedia };

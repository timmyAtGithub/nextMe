const pool = require('../server');

// Alle Chats eines Benutzers abrufen
const getChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT c.id, c.name, m.text AS lastMessage, m.created_at AS time FROM chats c ' +
      'LEFT JOIN messages m ON c.id = m.chat_id ' +
      'WHERE c.user_id = $1 ORDER BY m.created_at DESC',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Nachrichten eines Chats abrufen
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Nachricht senden
const sendMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO messages (chat_id, sender_id, text, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [chatId, senderId, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getChats, getMessages, sendMessage };

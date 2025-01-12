const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Datenbankverbindung erfolgreich');

module.exports = pool; 

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); 
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chats', chatRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));

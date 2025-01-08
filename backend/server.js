const express = require('express');
const dotenv = require('dotenv');
const pg = require('pg');

// Umgebungsvariablen laden
dotenv.config();
const app = express();
app.use(express.json());

// PostgreSQL Verbindung
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test-Route
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.send(result.rows[0]);
});

// Server starten
app.listen(5000, () => console.log('Server läuft auf Port 5000'));

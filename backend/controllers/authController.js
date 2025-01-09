const pool = require('../server');
const argon2 = require('argon2');

const registerUser = async (req, res) => {
  const { firstName, lastName, username, number, password } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const phoneCheck = await pool.query('SELECT * FROM users WHERE number = $1', [number]);
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Phone number already taken' });
    }

    const hashedPassword = await argon2.hash(password);

    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, username, number, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstName, lastName, username, number, hashedPassword]
    );

    res.status(201).json({ message: 'Benutzer erstellt!', user: result.rows[0] });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', user: user });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { registerUser, loginUser };

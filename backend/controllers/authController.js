const pool = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

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

    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
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

    const token = jwt.sign({  id: user.id, username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT id, username, profile_image FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching current user:', err.message);
    res.status(500).send('Server Error');
  }
};
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  try {
    if (!userId) {
      console.error('Error: User ID is missing');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      console.error(`Error: User with ID ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await argon2.verify(user.password, currentPassword);
    if (!passwordMatch) {
      console.error(`Error: Incorrect current password for user ID ${userId}`);
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await argon2.hash(newPassword);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    console.log(`Password successfully changed for user ID ${userId}`);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', {
      message: err.message,
      stack: err.stack,
      requestData: { userId, currentPassword: '***', newPassword: '***' },
    });
    res.status(500).send('Server Error');
  }
};


module.exports = { loginUser, registerUser, getCurrentUser, changePassword };



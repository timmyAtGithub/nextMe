const getUserDetails = async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await pool.query('SELECT username, profile_image FROM users WHERE id = $1', [userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Server Error:', err.message);
      res.status(500).send('Server Error');
    }
  };
  
  module.exports = { getUserDetails };
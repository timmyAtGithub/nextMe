const pool = require('../db');
const { getDistance } = require('geolib');

const sendRandoPics = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    const imagePath = `/uploads/randoImages/${req.file.filename}`;
    const fullImagePath = `${process.env.BASE_URL}${imagePath}`;

    const userLocationResult = await pool.query(
      'SELECT latitude, longitude FROM user_locations WHERE user_id = $1',
      [userId]
    );

    if (userLocationResult.rows.length === 0) {
      return res.status(404).json({ message: 'User location not found' });
    }

    const { latitude, longitude } = userLocationResult.rows[0];

    const nearbyUsersResult = await pool.query(
      'SELECT user_id, latitude, longitude FROM user_locations'
    );

    const nearbyUsers = nearbyUsersResult.rows.filter((user) => {
      const distance = getDistance(
        { latitude, longitude },
        { latitude: user.latitude, longitude: user.longitude }
      );
      return distance <= 3000 && user.user_id !== userId;
    });

    const selectedUsers = nearbyUsers.slice(0, 5);

    if (selectedUsers.length === 0) {
      return res.status(404).json({ message: 'No users found within 3 km' });
    }

    for (const user of selectedUsers) {
      await pool.query(
        'INSERT INTO randoImages (sender_id, receiver_id, image_url) VALUES ($1, $2, $3)',
        [userId, user.user_id, imagePath]
      );
    }

    res.status(200).json({
      message: `Image sent to ${selectedUsers.length} users`,
      recipients: selectedUsers.map((user) => user.user_id),
    });
  } catch (err) {
    console.error('Error sending random pics:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getReceivedPictures = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT r.id, r.image_url, r.sent_at, u.username, u.profile_image
      FROM randoImages r
      JOIN users u ON r.sender_id = u.id
      WHERE r.receiver_id = $1
      ORDER BY r.sent_at DESC
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No pictures found' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching pictures:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPictureById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT r.id, r.image_url, r.sent_at, u.username, u.profile_image,r.sender_id
      FROM randoImages r
      JOIN users u ON r.sender_id = u.id
      WHERE r.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Picture not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching picture by ID:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const removeRandoPic = async (req, res) => {
  const { id } = req.params; 
  const userId = req.user.id; 

  try {
    const result = await pool.query(
      'DELETE FROM randoImages WHERE id = $1 AND receiver_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Picture not found for this user' });
    }

    res.status(200).json({ message: 'Picture deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    console.error('Error deleting picture:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { sendRandoPics, getReceivedPictures, getPictureById, removeRandoPic };

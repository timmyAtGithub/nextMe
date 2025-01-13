const apiConfig = require('../configs/apiConfig');
const pool = require('../server');
const multer = require('multer');


const uploadProfileImage = async (req, res) => {
    try {
      if (!req.file) {
        console.error('File not uploaded or invalid');
        return res.status(400).json({ message: 'No file uploaded or invalid file type' });
      }
  
      console.log('Uploaded File:', req.file);
  
      const userId = req.user.id;
      const imagePath = `${apiConfig.BASE_URL}/uploads/profileImage/${req.file.filename}`;
      console.log("Image Path:", imagePath);
      await pool.query('UPDATE users SET profile_image = $1 WHERE id = $2', [imagePath, userId]);
  
      res.json({ profileImage: imagePath });
    } catch (err) {
      console.error('Error uploading profile image:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  


  const updateProfile = async (req, res) => {
    const { field, value } = req.body;
    const userId = req.user.id;
  
    console.log('Update Profile Request Received');
    console.log('User ID:', userId);
    console.log('Field to update:', field);
    console.log('New value:', value);
  
    try {
      if (!['username', 'about', 'profile_image'].includes(field)) {
        console.log('Invalid field:', field);
        return res.status(400).json({ message: 'Invalid field' });
      }
  
      if (field === 'username') {
        console.log('Checking if username already exists...');
        const result = await pool.query('SELECT id FROM users WHERE username = $1', [value]);
        console.log('Username query result:', result.rows);
        if (result.rows.length > 0) {
          console.log('Username already taken:', value);
          return res.status(400).json({ message: 'Username already taken' });
        }
      }
  
      console.log(`Updating ${field} for user ${userId}...`);
      const updateResult = await pool.query(`UPDATE users SET ${field} = $1 WHERE id = $2`, [value, userId]);
      console.log('Update query result:', updateResult);
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error('Error updating profile:', err.message);
      res.status(500).send('Server Error');
    }
  };

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT username, profile_image, about FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

const getContactDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT username, profile_image, about FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

const getFriends = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const result = await pool.query(
        `SELECT u.id, u.username AS name, u.profile_image, u.is_online
         FROM users u
         INNER JOIN friends f ON u.id = f.friend_id
         WHERE f.user_id = $1`,
        [userId]
      );
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching friends:', err.message);
      res.status(500).send('Server Error');
    }
  };

  const searchUsers = async (req, res) => {
    const { query } = req.query;
  
    try {
      const result = await pool.query(
        `SELECT id, username AS name, profile_image 
         FROM users 
         WHERE username ILIKE $1`,
        [`${query}%`] 
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error searching users:', err.message);
      res.status(500).send('Server Error');
    }
  };
  
  
  const sendFriendRequest = async (req, res) => {
    const senderId = req.user.id;
    const { receiverId } = req.body;
  
    try {
      const existingRequest = await pool.query(
        'SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2 AND status = $3',
        [senderId, receiverId, 'pending']
      );
  
      if (existingRequest.rows.length > 0) {
        return res.status(400).json({ message: 'Friend request already sent' });
      }
  
      await pool.query(
        'INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)',
        [senderId, receiverId]
      );
  
      res.status(200).json({ message: 'Friend request sent' });
    } catch (err) {
      console.error('Error sending friend request:', err.message);
      res.status(500).send('Server Error');
    }
  };
  const getFriendRequests = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const result = await pool.query(
        `SELECT fr.id, u.username AS sender_name, u.profile_image 
         FROM friend_requests fr
         INNER JOIN users u ON fr.sender_id = u.id
         WHERE fr.receiver_id = $1 AND fr.status = 'pending'`,
        [userId]
      );
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching friend requests:', err.message);
      res.status(500).send('Server Error');
    }
  };
  const respondToFriendRequest = async (req, res) => {
    const userId = req.user.id;
    const { requestId, action } = req.body; 
  
    try {
      const request = await pool.query(
        'SELECT * FROM friend_requests WHERE id = $1 AND receiver_id = $2',
        [requestId, userId]
      );
  
      if (request.rows.length === 0) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      await pool.query(
        'UPDATE friend_requests SET status = $1 WHERE id = $2',
        [action, requestId]
      );
  
      if (action === 'accepted') {
        const senderId = request.rows[0].sender_id;
        await pool.query(
          'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1)',
          [userId, senderId]
        );
      }
  
      res.status(200).json({ message: `Friend request ${action}` });
    } catch (err) {
      console.error('Error responding to friend request:', err.message);
      res.status(500).send('Server Error');
    }
  };

  const getSentFriendRequests = async (req, res) => {
    const userId = req.user.id;
    console.log('Fetching sent requests for user:', userId);
    try {
      const result = await pool.query(
        `SELECT receiver_id 
         FROM friend_requests 
         WHERE sender_id = $1 AND status = 'pending'`,
        [userId]
      );
      console.log('Database result:', result.rows); 
      const sentRequests = result.rows.map((row) => row.receiver_id);
      res.status(200).json(sentRequests);
    } catch (err) {
      console.error('Error fetching sent friend requests:', err.message);
      res.status(500).send('Server Error');
    }
  };
  
  

  module.exports = {getContactDetails, uploadProfileImage, updateProfile, getUserDetails, getFriends, sendFriendRequest, getFriendRequests, respondToFriendRequest, searchUsers, getSentFriendRequests};


  

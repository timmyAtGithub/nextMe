const pool = require('../db');


const deleteReport = async (req, res) => {
    const { reportId } = req.params;
  
    try {
      await pool.query('DELETE FROM reports WHERE id = $1', [reportId]);
      res.status(200).json({ message: 'Report deleted successfully.' });
    } catch (err) {
      console.error('Error deleting report:', err.message);
      res.status(500).send('Server Error');
    }
  };
  const banUser = async (req, res) => {
    const { userId } = req.params;

    const newUsername = `Banned User ${userId}`;
  
    try {
      await pool.query(
        `UPDATE users
         SET username = $1,
             profile_image = NULL,
             password = 'BannedUser',
             about = NULL
         WHERE id = $2`,
        [newUsername,userId]
      );
  
      await pool.query('DELETE FROM user_locations WHERE user_id = $1', [userId]);
      await pool.query('DELETE FROM friend_requests WHERE sender_id = $1 OR receiver_id = $1', [userId]);
      await pool.query('DELETE FROM friends WHERE user_id = $1 OR friend_id = $1', [userId]);
      await pool.query('DELETE FROM chats WHERE user1_id = $1 OR user2_id = $1', [userId]);
      await pool.query('DELETE FROM groupchat WHERE owner_id = $1', [userId]);
      await pool.query('DELETE FROM reports WHERE sender_id = $1 OR reporter_id = $1', [userId]);
      await pool.query('DELETE FROM groupmembers WHERE user_id = $1', [userId]);
      await pool.query('DELETE FROM randoimages WHERE sender_id = $1', [userId]);
  
      res.status(200).json({ message: 'User banned successfully.' });
    } catch (err) {
      console.error('Error banning user:', err.message);
      res.status(500).send('Server Error');
    }
  };

  const getReports = async (req, res) => {
    try {
      const reports = await pool.query(
        `
        SELECT 
          r.id AS report_id, 
          r.picture_id, 
          r.picture_url, 
          r.sender_id, 
          r.reporter_id
        FROM reports r
        JOIN users u ON r.reporter_id = u.id
        JOIN users s ON r.sender_id = s.id
        `
      );
  
      res.status(200).json(reports.rows); 
    } catch (err) {
      console.error('Error fetching reports:', err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  
  module.exports = {deleteReport, banUser, getReports };
const express = require('express');
const { uploadProfileImage ,getUserDetails, updateProfile, getFriends, sendFriendRequest, getFriendRequests, respondToFriendRequest, searchUsers, getSentFriendRequests } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');;
const router = express.Router();

router.post('/upload-profile-image', authenticateToken, upload.single('profileImage'), uploadProfileImage);
router.get('/me', authenticateToken, getUserDetails); 
router.post('/edit-profile', authenticateToken, updateProfile);
router.get('/friends', authenticateToken, getFriends);
router.post('/add-friend', authenticateToken, sendFriendRequest);
router.get('/friend-requests', authenticateToken, getFriendRequests);
router.post('/friend-requests/respond', authenticateToken, respondToFriendRequest);
router.get('/search', authenticateToken, searchUsers);
router.get('/sent-requests', authenticateToken, getSentFriendRequests);

module.exports = router;

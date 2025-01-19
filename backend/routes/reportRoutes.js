const express = require('express');
const router = express.Router();
const { deleteReport, banUser, getReports } = require('../controllers/reportController');
const { authenticateToken } = require("../middleware/authMiddleware");
const  isAdmin  = require('../middleware/isAdminMiddleware');

router.get('/getReports', authenticateToken, isAdmin, getReports);
router.delete('/deleteReport/:reportId', authenticateToken, isAdmin, deleteReport);
router.post('/banUser/:userId', authenticateToken, isAdmin, banUser);

module.exports = router;

const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const uploadRando = require('../middleware/uploadRandoMiddleware');
const { sendRandoPics, getReceivedPictures, getPictureById, removeRandoPic } = require("../controllers/randoPicsController");

const router = express.Router();

router.post('/send', authenticateToken, uploadRando.single('image'), sendRandoPics);
router.get('/received', authenticateToken, getReceivedPictures);
router.get('/:id', authenticateToken, getPictureById);
router.delete('/remove/:id', authenticateToken, removeRandoPic);

module.exports = router;

const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {getGroupMessagesWithName,getGroupDetails,sendGroupMedia,sendGroupMessage,getGroupMessages,getUserGroups,uploadGroupImage,createGroup,getGroupMembers,deleteGroup,addGroupMember,removeGroupMember,} = require("../controllers/groupController");
const upload = require("../middleware/groupMiddleware");
const uploadMedia = require('../middleware/uploadMediaMiddleware');


const router = express.Router();

router.post("/upload-image",authenticateToken,(req, res, next) => {console.log("Processing upload request");next();},upload.single("groupImage"),uploadGroupImage);
router.post("/create", authenticateToken, createGroup);
router.get("/members/:groupId", authenticateToken, getGroupMembers);
router.delete("/delete/:groupId", authenticateToken, deleteGroup);
router.post("/add-member/:groupId", authenticateToken, addGroupMember);
router.delete("/remove-member/:groupId", authenticateToken, removeGroupMember);
router.get("/me", authenticateToken, getUserGroups);
router.get('/messages/:groupId', authenticateToken, getGroupMessages);
router.post('/messages', authenticateToken, sendGroupMessage);
router.post("/send-media", authenticateToken, uploadMedia.single("media"), sendGroupMedia);
router.get("/details/:groupId", authenticateToken, getGroupDetails);
router.get("/messagesWithName/:groupId", authenticateToken, getGroupMessagesWithName);

module.exports = router;

const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { updateLocation, getLocation } = require("../controllers/locationController");

const router = express.Router();

router.post("/update", authenticateToken, updateLocation);

router.get("/me", authenticateToken, getLocation);

module.exports = router;

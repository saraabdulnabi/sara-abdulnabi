const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route
router.get("/public", userController.getPublicData);

// Protected route
router.get("/protected", authMiddleware, userController.getProtectedData);

module.exports = router;

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile/profileController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.post("/init", authenticateToken, profileController.initProfile);
router.get("/info", authenticateToken, profileController.infoProfile);
module.exports = router;

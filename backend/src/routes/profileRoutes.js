const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile/profileController");

router.post("/profile-init", profileController.initProfile);

module.exports = router;

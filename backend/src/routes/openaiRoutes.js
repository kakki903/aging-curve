const express = require("express");
const router = express.Router();
const openaiController = require("../controllers/openai/openaiController.js");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/get", authenticateToken, openaiController.get);
router.post("/init", authenticateToken, openaiController.init);
module.exports = router;

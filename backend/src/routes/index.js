const express = require("express");
const router = express.Router();

// 1. 기능별 라우터 불러오기
const authRoutes = require("./authRoutes");
// '/api/v1' 뒤에 '/auth'가 붙습니다.
router.use("/auth", authRoutes);

module.exports = router;

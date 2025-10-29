const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");

// 1. 로컬 회원가입 엔드포인트 (POST /api/v1/auth/register-local)
router.post("/register-local", authController.registerLocal);

// 2. 로컬 로그인 엔드포인트 (POST /api/v1/auth/login-local)
router.post("/login-local", authController.loginLocal);

// 3. 토큰 인증
router.post("/verify-email", authController.verifyEmail);
module.exports = router;

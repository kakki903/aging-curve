const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key"; // .env에 시크릿 키 설정 필수

// 1. 로컬 회원가입 엔드포인트 (POST /api/v1/auth/register-local)
router.post("/register-local", authController.registerLocal);
// 2. 로컬 로그인 엔드포인트 (POST /api/v1/auth/login-local)
router.post("/login-local", authController.loginLocal);
// 3. 토큰 인증
router.post("/verify-email", authController.verifyEmail);
router.post("/login-social", authController.loginSocial);
// 카카오 로그인
router.get(
  "/kakao",
  passport.authenticate("kakao", {
    scope: ["profile_nickname", "account_email"],
  })
);
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    session: false,
    failureRedirect:
      process.env.FRONTEND_BASE_URL + "/login?error=kakao_failed",
  }),
  (req, res) => {
    if (!req.user || !req.user.user_id) {
      console.error("Passport verified user object is missing ID:", req.user);
      return res.redirect(
        process.env.FRONTEND_BASE_URL + "/login?error=auth_internal_error"
      );
    }

    const token = jwt.sign({ userId: req.user.user_id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    const nickname = encodeURIComponent(req.user.nickname || "User");

    res.redirect(`${process.env.FRONTEND_BASE_URL}/login?token=${token}`);
  }
);
module.exports = router;

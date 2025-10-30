const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const jwt = require("jsonwebtoken");

// 💡 Passport 직렬화/역직렬화 설정
// 사용자 세션을 사용하는 경우 필요하지만, JWT 기반 REST API에서는 단순화될 수 있습니다.
// 여기서는 JWT 사용을 전제로 간략화합니다.
passport.serializeUser((user, done) => {
  // JWT를 사용하므로 user_id만 직렬화
  done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
  // 실제 사용자 정보를 DB에서 조회하는 로직은 service 계층에서 담당
  // 여기서는 단순히 id를 반환
  done(null, { user_id: id });
});

// -----------------------------------------------------
// 🔑 카카오 로그인 전략 설정
// -----------------------------------------------------
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "", // 시크릿이 없으면 빈 문자열
      callbackURL: process.env.KAKAO_REDIRECT_URL,
      scope: ["profile_nickname", "account_email"],
      session: false,
    },
    // OAuth 인증 후 실행되는 콜백 함수
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ⭐️ 1. 카카오 서비스의 고유 ID와 종류를 추출
        const kakaoId = profile.id;
        const provider = "kakao";

        // ⭐️ 2. 여기서 인증 서비스(authService)를 호출하여 사용자 정보를 처리합니다.
        // 이 로직은 authService.socialLogin(provider, kakaoId, profile)에 정의됩니다.
        const authService = require("../services//auth/authService"); // 순환 참조 주의
        const user = await authService.socialLogin(provider, kakaoId, profile);

        // 3. 성공적으로 사용자 정보를 처리했으면 done 호출
        done(null, user);
      } catch (error) {
        console.error("카카오 로그인 콜백 에러:", error);
        done(error);
      }
    }
  )
);

module.exports = passport;

const authService = require("../../services/auth/authService");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key"; // .env에 시크릿 키 설정 필수

const authController = {
  // 로컬 회원가입 POST 요청 처리
  registerLocal: async (req, res) => {
    const { email, nickname, password } = req.body;

    // [1차 검증]: 기본 입력값 누락 확인
    if (!email || !nickname || !password) {
      return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
    }
    // [TODO]: 이메일 형식, 비밀번호 강도 등 추가 검증 필요

    try {
      const newUser = await authService.registerLocal(
        email,
        nickname,
        password
      );

      // 성공 응답 (민감한 비밀번호 정보는 제외하고 응답)
      res.status(201).json({
        user_id: newUser.user_id,
        email: newUser.email,
        nickname: newUser.nickname,
        message: "회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.",
      });
    } catch (error) {
      // Service에서 발생한 중복 또는 기타 에러 처리
      res.status(400).json({ message: error.message });
    }
  },

  // 로컬 로그인 POST 요청 처리
  loginLocal: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "이메일과 비밀번호를 입력해야 합니다." });
    }

    try {
      const user = await authService.loginLocal(email, password);

      // 1. JWT 토큰 생성 (사용자 ID와 권한 정보를 담음)
      const token = jwt.sign(
        { userId: user.user_id, role: user.role_type },
        JWT_SECRET,
        { expiresIn: "1h" } // 토큰 만료 시간 설정
      );

      // 2. 응답: 토큰과 사용자 정보를 클라이언트에 반환
      res.status(200).json({
        message: "로그인 성공",
        token: token,
        user: {
          user_id: user.user_id,
          nickname: user.nickname,
          email: user.email,
          role_type: user.role_type,
        },
      });
    } catch (error) {
      // Service에서 발생한 오류 (비밀번호 불일치, 미인증 등) 처리
      res.status(401).json({ message: error.message }); // 401: Unauthorized
    }
  },

  verifyEmail: async (req, res) => {
    // 1. 토큰을 요청 본문(req.body)에서 가져옵니다. (변경 없음)
    const { token } = req.body;

    if (!token) {
      // JSON 응답으로 변경
      return res.status(400).json({ message: "토큰이 누락되었습니다." });
    }

    try {
      // 2. 인증 서비스 호출 (변경 없음)
      await authService.verifyEmail(token);

      // 3. ⭐️⭐️ 성공 시, 단순한 JSON 응답을 반환합니다. ⭐️⭐️
      // HTML 페이지 반환 로직은 이제 필요 없습니다.
      res.status(200).json({
        message: "이메일 인증이 성공적으로 완료되었습니다.",
        verified: true,
      });
    } catch (error) {
      // 4. 실패 시, JSON 응답을 반환하여 프론트엔드가 오류를 처리하게 합니다.
      res.status(400).json({
        message:
          error.message || "인증 처리 중 알 수 없는 오류가 발생했습니다.",
      });
    }
  },

  // 로컬 로그인 POST 요청 처리
  loginSocial: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "로그인 실패하였습니다." });
    }

    try {
      const user = await authService.loginSocial(userId);

      // 1. JWT 토큰 생성 (사용자 ID와 권한 정보를 담음)
      const token = jwt.sign(
        { userId: user.user_id, role: user.role_type },
        JWT_SECRET,
        { expiresIn: "1h" } // 토큰 만료 시간 설정
      );

      // 2. 응답: 토큰과 사용자 정보를 클라이언트에 반환
      res.status(200).json({
        message: "로그인 성공",
        token: token,
        user: {
          user_id: user.user_id,
          nickname: user.nickname,
          email: user.email,
          role_type: user.role_type,
        },
      });
    } catch (error) {
      // Service에서 발생한 오류 (비밀번호 불일치, 미인증 등) 처리
      res.status(401).json({ message: error.message }); // 401: Unauthorized
    }
  },
};

module.exports = authController;

const userRepository = require("../../repositories/user/userRepository");
const tokenRepository = require("../../repositories/token/tokenRepository");
const bcrypt = require("bcrypt");
const saltRounds = 10; // 해싱 강도 설정
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const authService = {
  // 1. 로컬 회원가입 서비스
  registerLocal: async (email, nickname, password) => {
    // 1. 유효성 검사 및 중복 확인
    const existingUser = await userRepository.findByEmailOrNickname(
      email,
      nickname
    );

    if (existingUser) {
      // 정상 계정에 대해서만 중복 체크 ( 탈퇴 후 재사용 가능 )
      if (existingUser.is_deleted === false) {
        throw new Error("이미 존재하는 이메일 또는 닉네임입니다.");
      }
    }

    // 2. 비밀번호 해싱 (암호화)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Repository를 통한 데이터 저장 (트랜잭션 실행)
    const newUser = await userRepository.createLocalUser(
      email,
      nickname,
      hashedPassword
    );

    const token = uuidv4(); // token create
    const expiresAt = new Date(Date.now() + 3600000); // 1시간 만료

    await tokenRepository.createToken(
      newUser.user_id,
      token,
      "EMAIL_VERIFICATION",
      expiresAt.toISOString()
    );

    const verificationLink = `http://localhost:3001/verify-email?token=${token}`;
    await transporter.sendMail({
      form: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "[서비스명] 회원가입 이메일 주소 인증",
      html: `
        <p>안녕하세요. ${newUser.nickname}님!</p>
        <p>회원가입을 완료하려면 아래 링크를 클릭하여 이메일 주소를 인증해주세요.</p>
        <a href="${verificationLink}">이메일 인증하기</a>
        <p>이 링크는 1시간 동안 유효합니다.</p>
      `,
    });

    return newUser;
  },

  // 2. 로컬 로그인 서비스
  loginLocal: async (email, password) => {
    // 1. 이메일로 사용자 및 인증 정보 조회
    const user = await userRepository.findByEmailWithAuth(email);

    // 2. 계정 상태 검증
    if (user.is_deleted) {
      throw new Error("탈퇴 처리된 계정입니다.");
    }
    if (!user.is_verified) {
      throw new Error("이메일 인증이 완료되지 않은 계정입니다.");
    }

    if (!user) {
      // 보안상 사용자에게 이메일 또는 비밀번호가 틀렸다고만 알려주는 것이 일반적
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // 3. 비밀번호 비교 (해시된 비밀번호와 요청된 비밀번호 비교)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // 4. 로그인 성공 (비밀번호, 해시 등 민감 정보 제거 후 반환)
    const { password: _, ...userInfo } = user; // password 필드 제거
    return userInfo;
  },

  verifyEmail: async (token) => {
    const tokenRecord = await tokenRepository.findToken(token);

    if (!tokenRecord) {
      throw new Error("유효하지 않거나 만료된 인증 토큰입니다.");
    }
    if (tokenRecord.token_type !== "EMAIL_VERIFICATION") {
      throw new Error("토큰이 잘못되었습니다.");
    }

    await tokenRepository.verifyUser(userId);
    await tokenRepository.deleteToken(token);

    return { success: true, userId };
  },
};

module.exports = authService;

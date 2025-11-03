const jwt = require("jsonwebtoken"); // ⭐️ jsowebtoken 라이브러리 가정
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_fallback"; // 비밀 키

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 누락되었습니다." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error("JWT 검증 오류:", err.message);
    return res
      .status(403)
      .json({ message: "유효하지 않거나 만료된 토큰입니다." });
  }
};

module.exports = authMiddleware;

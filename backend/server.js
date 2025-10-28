// .env 파일 로드
require("dotenv").config();
const express = require("express");
const apiRouter = require("./src/routes/api"); // 라우터 불러오기
const cors = require("cors"); // CORS 미들웨어 불러오기
const { connectDB } = require("./src/config/db"); // 구조분해 할당으로 함수를 불러옵니다.
connectDB(); // DB 연결

const app = express();
// 환경 변수에 설정된 포트 또는 기본값 3000 사용
const PORT = process.env.PORT || 3000;

// 1. CORS 설정 추가: React 앱의 주소로만 허용하는 것이 보안에 좋습니다.
// React의 기본 개발 서버 포트: 3000 (프론트엔드 서버 포트)
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};
app.use(cors(corsOptions));
// 미들웨어: JSON 요청 본문 파싱 설정
app.use(express.json());

// '/api/v1' 경로로 모든 API 라우터를 연결합니다.
app.use("/api/v1", apiRouter);
// 서버가 시작되면 DB 연결 함수도 호출할 수 있지만, 지금은 생략합니다.
// connectDB();

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ API base path is /api/v1`);
});

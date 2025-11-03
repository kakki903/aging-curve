require("dotenv").config();
const express = require("express");
const apiRouter = require("./src/routes/index"); // 통합 Router
const cors = require("cors"); // CORS 미들웨어 불러오기
const { connectDB } = require("./src/config/db"); // 구조분해 할당으로 함수를 불러옵니다.
connectDB(); // DB 연결

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", apiRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}/api/v1`);
});

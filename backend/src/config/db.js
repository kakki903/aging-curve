const { Pool } = require("pg");

// .env 파일에서 정보를 가져와 DB 풀 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// DB 연결 테스트 함수 (서버 시작 시 호출)
const connectDB = async () => {
  try {
    await pool.query("SELECT 1"); // 간단한 쿼리로 연결 확인
    console.log("✅ PostgreSQL connected successfully!");
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error.stack);
    process.exit(1); // 연결 실패 시 서버 종료
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params), // 쿼리 함수 제공
  connectDB,
  pool: pool,
};

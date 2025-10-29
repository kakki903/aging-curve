import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("로그인 시도 중...");
    try {
      // 백엔드의 로컬 로그인 엔드포인트 호출
      const res = await api.post("/auth/login-local", formData);

      // 1. 성공 시 JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem("token", res.data.token);
      // [선택 사항] 사용자 정보도 저장 (user_id, nickname 등)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 2. 로그인 상태 업데이트 (App.js에서 상태 관리)
      setIsLoggedIn(true);

      setMessage(`✅ 로그인 성공!`);

      // 3. 메인 페이지로 이동
      navigate("/main");
    } catch (error) {
      // 백엔드 에러 메시지 처리 (401 Unauthorized, 미인증 계정 등)
      setMessage(
        `❌ ${
          error.response?.data?.message || "로그인 중 오류가 발생했습니다."
        }`
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
      }}
    >
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#28a745",
            color: "white",
            border: "none",
          }}
        >
          로그인
        </button>
      </form>
      <p
        style={{
          marginTop: "15px",
          color: message.startsWith("❌") ? "red" : "green",
        }}
      >
        {message}
      </p>
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        계정이 없으신가요?{" "}
        <button onClick={() => navigate("/signup")}>회원가입</button>
      </p>
    </div>
  );
}

export default LoginPage;

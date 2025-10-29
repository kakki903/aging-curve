import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("회원가입 시도 중...");
    try {
      // 백엔드의 로컬 회원가입 엔드포인트 호출
      const res = await api.post("/auth/register-local", formData);

      setMessage(
        `✅ ${res.data.message || "가입 성공! 이메일 인증 후 로그인해주세요."}`
      );

      // 2초 후 로그인 페이지로 이동하여 이메일 인증을 유도
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // 백엔드 에러 메시지 표시 (예: "이미 존재하는 이메일입니다.")
      setMessage(
        `❌ ${
          error.response?.data?.message ||
          "회원가입 중 알 수 없는 오류가 발생했습니다."
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
      <h2>로컬 계정 회원가입</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
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
            background: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          가입하기
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
    </div>
  );
}

export default SignUpPage;

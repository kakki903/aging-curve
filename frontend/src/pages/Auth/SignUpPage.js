import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

// --------------------------------------------------------------------
// 🔑 카카오 소셜 로그인 URL 정의
// --------------------------------------------------------------------
const KAKAO_AUTH_URL = "http://localhost:3000/api/v1/auth/kakao";

// --------------------------------------------------------------------
// 🎨 카카오 아이콘 컴포넌트 (SVG)
// --------------------------------------------------------------------
const KakaoIcon = (props) => (
  // 카카오 브랜드 컬러 (#191919 색상의 아이콘)
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#191919"
  >
    <path d="M12 0C5.373 0 0 4.846 0 10.835c0 3.784 2.428 7.031 6.096 8.761l-1.071 3.861c-.085.309.28.601.564.444l4.63-2.617c.594.093 1.2.14 1.811.14c6.627 0 12-4.846 12-10.835C24 4.846 18.627 0 12 0z" />
  </svg>
);

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

  // ⭐️ 카카오 소셜 로그인 리다이렉션 함수
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px", // 스타일 추가
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // 스타일 추가
        fontFamily: "sans-serif", // 스타일 추가
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>회원가입</h2>

      {/* 로컬 회원가입 폼 */}
      <h3 style={{ fontSize: "1.1em", textAlign: "center", margin: "15px 0" }}>
        로컬 계정 가입
      </h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          가입하기
        </button>
      </form>

      {/* 구분선 추가 */}
      <div
        style={{ margin: "20px 0", textAlign: "center", position: "relative" }}
      >
        <div style={{ borderTop: "1px solid #eee" }} />
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "0 10px",
            fontSize: "12px",
            color: "#888",
          }}
        >
          또는
        </span>
      </div>

      {/* ⭐️ 카카오 회원가입 버튼 추가 */}
      <button
        type="button"
        onClick={handleKakaoLogin}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "10px",
          background: "#FEE500", // 카카오 옐로우
          color: "#191919",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          gap: "8px",
        }}
      >
        <KakaoIcon />
        카카오로 간편 가입
      </button>

      <p
        style={{
          marginTop: "15px",
          textAlign: "center",
          color: message.startsWith("❌") ? "red" : "green",
          fontWeight: "600",
        }}
      >
        {message}
      </p>
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        이미 계정이 있으신가요?{" "}
        <button
          onClick={() => navigate("/login")}
          style={{
            border: "none",
            background: "none",
            color: "#007bff",
            cursor: "pointer",
            padding: 0,
          }}
        >
          로그인
        </button>
      </p>
    </div>
  );
}

export default SignUpPage;

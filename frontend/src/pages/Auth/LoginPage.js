import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation과 useEffect를 사용하기 위해 임포트
import { jwtDecode } from "jwt-decode";
// --------------------------------------------------------------------
// 🔑 소셜 로그인 관련 상수 및 헬퍼 함수
// --------------------------------------------------------------------
const KAKAO_AUTH_URL = "http://localhost:3000/api/v1/auth/kakao";

/**
 * JWT 토큰을 로컬 스토리지에 저장하는 함수
 */
const saveToken = (token) => {
  localStorage.setItem("token", token);
};
const saveUser = (user) => {
  localStorage.setItem("user", user);
};

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

function LoginPage({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // ⭐️ 소셜 로그인 리다이렉션 처리를 위해 추가

  // --------------------------------------------------------------------
  // 🔑 소셜 로그인 콜백 처리 로직 (useEffect)
  // --------------------------------------------------------------------
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const error = query.get("error");

    const tokenLogin = async (token) => {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const res = await api.post("/auth/login-social", { userId: userId });
        saveToken(token);
        console.log(res.data.user);
        saveUser(res.data.user);
        setIsLoggedIn(true); // 외부 상태 업데이트
        setMessage(`✅ 소셜 로그인 성공!`);
        // replace: true를 사용하여 URL 히스토리에 토큰이 남지 않도록 합니다.
        navigate("/main", { replace: true });
      } catch (e) {
        console.error("소셜 로그인 후 사용자 정보 조회 오류:", e);
        // 오류 발생 시 토큰과 메시지를 초기화하고 로그인 페이지로 복귀
        localStorage.removeItem("token");
        setMessage(
          "❌ 사용자 정보를 가져오는 데 실패했습니다. 다시 시도해 주세요."
        );
        navigate("/login", { replace: true });
      }
    };

    if (token) {
      try {
        tokenLogin(token);
      } catch (e) {
        console.error("Token decoding error:", e);
        setMessage("❌ 유효하지 않은 토큰입니다.");
        navigate("/login", { replace: true });
      }
    } else if (error) {
      // 소셜 로그인 실패
      setMessage(
        `❌ ${
          error === "kakao_failed"
            ? "카카오 로그인에 실패했습니다."
            : "로그인 처리 중 오류가 발생했습니다."
        }`
      );
      // URL에서 에러 파라미터 제거 (URL을 /login으로 정리)
      navigate("/login", { replace: true });
    }
  }, [location.search, navigate, setIsLoggedIn]);

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

  // ⭐️ 카카오 로그인 리다이렉션 함수
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
        // 스타일 추가
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>로그인</h2>
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
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          로컬 로그인
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

      {/* ⭐️ 카카오 로그인 버튼 추가 */}
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
        카카오로 3초 만에 시작하기
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
        계정이 없으신가요?{" "}
        <button
          onClick={() => navigate("/signup")}
          style={{
            border: "none",
            background: "none",
            color: "#007bff",
            cursor: "pointer",
            padding: 0,
          }}
        >
          회원가입
        </button>
      </p>
    </div>
  );
}

export default LoginPage;

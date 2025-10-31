import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MainPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userNickname, setUserNickname] = useState("Guest");

  useEffect(() => {
    // 로컬 스토리지에서 저장된 사용자 정보(닉네임)를 가져와 표시
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);

        // 1. 파싱된 객체에서 nickname 필드를 찾습니다.
        let nickname = userObj.nickname || "User";

        // 2. 만약 파싱된 값이 객체가 아니라 닉네임 문자열 자체라면 해당 문자열을 사용합니다.
        if (typeof userObj === "string") {
          nickname = userObj;
        }

        setUserNickname(nickname);
      } catch (e) {
        // JSON 파싱 오류가 발생하면, 저장된 값 자체가 닉네임이라고 가정하고 사용합니다.
        setUserNickname(storedUser);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // 1. 토큰 삭제
    localStorage.removeItem("user"); // 2. 사용자 정보 삭제
    setIsLoggedIn(false); // 3. 상태 업데이트
    navigate("/login"); // 4. 로그인 페이지로 리다이렉트
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "30px",
        textAlign: "center",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // 디자인 개선
        fontFamily: "sans-serif",
        backgroundColor: "#ffffff",
      }}
    >
      <h1
        style={{
          color: "#28a745",
          borderBottom: "2px solid #28a745",
          paddingBottom: "15px",
        }}
      >
        환영합니다, {userNickname}님! 🎉
      </h1>
      <p style={{ marginTop: "20px", fontSize: "1.1em", color: "#333" }}>
        이곳은 **AI 포트폴리오의 핵심 서비스 영역**입니다.
      </p>

      <hr style={{ margin: "40px 0", borderColor: "#f0f0f0" }} />

      <div
        style={{
          padding: "30px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px dashed #ced4da",
        }}
      >
        <p style={{ color: "#6c757d" }}>
          여기에 AI 모델 호출, 이미지 생성/조회, 데이터 입력 등 포트폴리오
          기능을 구현하세요.
        </p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          padding: "12px 25px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1em",
          transition: "background-color 0.3s",
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default MainPage;

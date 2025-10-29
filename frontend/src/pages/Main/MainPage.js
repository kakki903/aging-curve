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
        setUserNickname(userObj.nickname || "User");
      } catch (e) {
        console.error("사용자 정보 파싱 오류:", e);
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
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>환영합니다, {userNickname}님! 🎉</h1>
      <p>이곳은 **AI 포트폴리오의 핵심 서비스 영역**입니다.</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#dc3545",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        로그아웃
      </button>

      <hr style={{ margin: "40px 0" }} />

      <p>
        여기에 AI 모델 호출, 이미지 생성/조회, 데이터 입력 등 포트폴리오 기능을
        구현하세요.
      </p>
    </div>
  );
}

export default MainPage;

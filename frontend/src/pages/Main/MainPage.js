import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import InitForm from "../../components/Profile/InitForm";
import ViewForm from "../../components/Profile/ViewForm";

function MainPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userNickname, setUserNickname] = useState("Guest");
  const [profileData, setProfileData] = useState(undefined);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        let nickname = userObj.nickname || "User";
        if (typeof userObj === "string") {
          nickname = userObj;
        }
        setUserNickname(nickname);
      } catch (e) {
        setUserNickname(storedUser);
      }
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const res = await api.get("/profile/info");
      setProfileData(res.data.profile);
    } catch (error) {
      setProfileData(null);
    } finally {
      setIsPageLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isPageLoading) {
    return (
      <div className="text-center p-10 mt-20 text-xl text-gray-600">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); // 1. 토큰 삭제
    localStorage.removeItem("user"); // 2. 사용자 정보 삭제
    setIsLoggedIn(false); // 3. 상태 업데이트
    navigate("/login"); // 4. 로그인 페이지로 리다이렉트
  };
  const handleProfileSubmitSuccess = async () => {
    await fetchProfile();
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
        <button
          onClick={handleLogout}
          style={{
            padding: "10px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "15px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1em",
            transition: "background-color 0.3s",
          }}
        >
          logout
        </button>
      </h1>
      <div>
        {profileData ? (
          <ViewForm data={profileData} />
        ) : (
          <InitForm onProfileSubmit={handleProfileSubmitSuccess} />
        )}
      </div>
    </div>
  );
}

export default MainPage;

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// 변경된 디렉토리 구조에 맞게 컴포넌트 import
import MainPage from "./pages/Main/MainPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import VerifyEmailPage from "./pages/Token/VerifyEmailPage";
import LoginPage from "./pages/Auth/LoginPage";
import Predict1YearPage from "./pages/Predict/Predict1YearPage";
import Predict10YearPage from "./pages/Predict/Predict10YearPage";
import PredictLifetimePage from "./pages/Predict/PredictLifetimePage";

function App() {
  // 1. 로그인 상태 (isLoggedIn) 관리
  // 초기값은 로컬 스토리지에 'token'이 있는지 확인하여 설정
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // 2. 토큰 변경 감지 (옵션)
  // 컴포넌트 마운트 시 토큰 존재 여부를 다시 확인
  useEffect(() => {
    // window.addEventListener('storage', handleStorageChange); // 로컬 스토리지 변경 이벤트 감지 (옵션)
    setIsLoggedIn(!!localStorage.getItem("token"));
    // return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 3. Protected Route 컴포넌트 정의 (로그인 보호)
  // 이 컴포넌트에 감싸진 페이지는 로그인이 되어야 접근 가능합니다.
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      // 토큰이 없으면 로그인 페이지로 강제 이동
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div
        className="app-container"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <Routes>
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainPage setIsLoggedIn={setIsLoggedIn} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/predict/1year"
            element={
              <ProtectedRoute>
                <Predict1YearPage setIsLoggedIn={setIsLoggedIn} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/predict/10year"
            element={
              <ProtectedRoute>
                <Predict10YearPage setIsLoggedIn={setIsLoggedIn} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/predict/lifetime"
            element={
              <ProtectedRoute>
                <PredictLifetimePage setIsLoggedIn={setIsLoggedIn} />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/main" replace />
              ) : (
                <LoginPage setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/main" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

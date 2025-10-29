// 파일 경로: frontend/src/api/api.js

import axios from "axios";

// 1. axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // 백엔드 서버의 기본 URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. 요청 인터셉터: 모든 요청이 나가기 전에 실행
api.interceptors.request.use(
  (config) => {
    // Local Storage에서 JWT 토큰을 가져옵니다.
    const token = localStorage.getItem("token");

    // 토큰이 있으면 Authorization 헤더에 Bearer 토큰 형식으로 추가합니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 응답 인터셉터: (선택 사항) 토큰 만료 시 자동 로그아웃 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 에러가 발생하고 토큰이 있다면, 로그아웃 처리
    if (
      error.response &&
      error.response.status === 401 &&
      localStorage.getItem("token")
    ) {
      console.log("JWT 만료 또는 인증 실패. 자동 로그아웃 처리.");
      localStorage.removeItem("token");
      // 🚨 여기서 window.location.href('/login') 등으로 리다이렉션 처리 가능
    }
    return Promise.reject(error);
  }
);

export default api;

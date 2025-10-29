import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api"; // Axios 인스턴스 (Base URL 등 설정된)
import axios from "axios"; // Axios 라이브러리 자체 import

function VerifyEmailPage() {
  const [status, setStatus] = useState("인증을 처리 중입니다...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Axios CancelToken 생성: 진행 중인 요청을 취소하기 위한 도구
    const source = axios.CancelToken.source();

    const query = new URLSearchParams(location.search);
    const token = query.get("token"); // URL에서 token=XYZ 값을 추출

    if (!token) {
      setStatus("❌ 오류: 인증 토큰이 URL에서 발견되지 않았습니다.");
      return;
    }

    const verify = async () => {
      try {
        // API 호출 시 CancelToken을 함께 전달
        await api.post(
          "/auth/verify-email",
          { token },
          {
            cancelToken: source.token, // 요청에 취소 토큰 포함
          }
        );

        // 요청이 취소되지 않고 성공적으로 완료되었을 경우
        setStatus("✅ 이메일 인증이 성공적으로 완료되었습니다!");

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        // 요청 취소(Strict Mode의 2차 호출)로 인한 오류인지 확인
        if (axios.isCancel(error)) {
          // console.log('요청이 취소되었습니다:', error.message);
          return; // 취소된 요청이므로, 상태 업데이트를 무시하고 종료
        }

        // 일반적인 API 오류 (토큰 만료, 서버 오류 등) 처리
        const message =
          error.response?.data?.message ||
          "인증 중 알 수 없는 오류가 발생했습니다.";
        setStatus(`❌ 인증 실패: ${message}`);
      }
    };

    verify();

    // 2. Cleanup 함수: 컴포넌트가 정리되거나 재실행될 때 (Strict Mode),
    // 진행 중인 비동기 요청을 취소하여 두 번째 호출이 상태를 덮어쓰는 것을 방지
    return () => {
      source.cancel("Verify email request canceled on cleanup.");
    };
  }, [location.search, navigate]);

  return (
    <div
      style={{ maxWidth: "600px", margin: "100px auto", textAlign: "center" }}
    >
      <h2>이메일 주소 확인</h2>
      <p style={{ color: status.startsWith("❌") ? "red" : "green" }}>
        {status}
      </p>
    </div>
  );
}

export default VerifyEmailPage;

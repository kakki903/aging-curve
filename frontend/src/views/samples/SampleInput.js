import React, { useState } from "react";
import axios from "axios";

function SampleInput({ onDataSubmitted }) {
  const [username, setUsername] = useState("");
  const [userage, setUserage] = useState("");
  const [status, setStatus] = useState("");
  const API_URL = "http://localhost:3000/api/v1/samples";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("전송 중...");

    try {
      const ageInt = parseInt(userage);
      if (isNaN(ageInt) || ageInt < 0) {
        setStatus("유효하지 않은 나이입니다.");
        return;
      }

      // 백엔드에 데이터 POST 요청
      await axios.post(API_URL, {
        username,
        userage: ageInt,
      });

      setStatus("✅ 저장 완료!");
      setUsername("");
      setUserage("");
      onDataSubmitted(); // 목록을 새로고침하기 위해 부모 컴포넌트 함수 호출
    } catch (error) {
      setStatus(
        `❌ 저장 실패: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h2>데이터 입력</h2>
      <input
        type="text"
        placeholder="이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="나이"
        value={userage}
        onChange={(e) => setUserage(e.target.value)}
        required
      />
      <button type="submit">저장</button>
      <p style={{ color: status.startsWith("❌") ? "red" : "green" }}>
        {status}
      </p>
    </form>
  );
}

export default SampleInput;

import React, { useState } from "react";
import api from "../../api/api"; // API 호출 함수

function Predict1YearPage() {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    setPredictionData(null);

    try {
      const res = await api.post("/openai/init", {
        period: "month",
      });

      const resultJson = res.data.data.predictions;

      // 상태 업데이트: 컴포넌트가 새로운 데이터로 다시 렌더링됩니다.
      setPredictionData(resultJson);
      console.log("API 응답 JSON:", resultJson);
    } catch (err) {
      console.error("API 호출 중 에러 발생:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 렌더링 로직
  return (
    <div>
      <h1>앞으로 1년 예측 결과</h1>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "조회 중..." : "조회하기"}
      </button>

      <hr />

      {isLoading && <p>데이터를 불러오는 중입니다...</p>}

      {error && <p style={{ color: "red" }}>에러: {error}</p>}

      {predictionData ? (
        <div>
          <h2>분석 결과 (JSON)</h2>
          <pre
            style={{
              backgroundColor: "#f4f4f4",
              padding: "10px",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(predictionData, null, 2)}
          </pre>

          <h3>
            12월 종합 점수:
            {predictionData.predictions?.[0]?.overall?.score}점
          </h3>
        </div>
      ) : (
        !isLoading && <p>조회 버튼을 눌러 예측 결과를 확인하세요.</p>
      )}
    </div>
  );
}

export default Predict1YearPage;

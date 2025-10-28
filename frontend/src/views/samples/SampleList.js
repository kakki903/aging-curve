import React, { useState, useEffect } from "react";
import axios from "axios";

function SampleList({ refreshTrigger }) {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:3000/api/v1/samples";

  useEffect(() => {
    fetchSamples();
  }, [refreshTrigger]); // refreshTrigger가 변경될 때마다 목록 새로고침

  const fetchSamples = async () => {
    try {
      setLoading(true);
      // 백엔드에 데이터 GET 요청
      const response = await axios.get(API_URL);
      setSamples(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch samples:", error);
      setLoading(false);
    }
  };

  if (loading) return <p>데이터를 불러오는 중...</p>;

  return (
    <div>
      <h2>입력된 데이터 목록</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              이름 (username)
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              나이 (userage)
            </th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample) => (
            <tr key={sample.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {sample.id}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {sample.username}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {sample.userage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {samples.length === 0 && <p>저장된 데이터가 없습니다.</p>}
    </div>
  );
}

export default SampleList;

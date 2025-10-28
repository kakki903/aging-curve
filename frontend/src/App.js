import React, { useState } from "react";
import SampleInput from "./views/samples/SampleInput";
import SampleList from "./views/samples/SampleList";

function App() {
  // 상태가 변경될 때마다 SampleList를 새로고침하기 위한 트리거
  const [refreshList, setRefreshList] = useState(0);

  // 데이터가 성공적으로 제출되면 이 함수를 호출하여 리스트를 새로고침
  const handleDataSubmitted = () => {
    setRefreshList((prev) => prev + 1);
  };

  return (
    <div style={{ padding: "50px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>PostgreSQL 연동 포트폴리오 예제</h1>

      <SampleInput onDataSubmitted={handleDataSubmitted} />

      <hr style={{ margin: "30px 0" }} />

      <SampleList refreshTrigger={refreshList} />
    </div>
  );
}

export default App;

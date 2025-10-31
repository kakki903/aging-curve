import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

// 연차 드롭다운 옵션 (1년차부터 30년차 이상까지)
const experienceYears = Array.from({ length: 30 }, (_, i) => i + 1);

// 현재 날짜를 YYYY-MM-DD 문자열로 변환하는 헬퍼 함수
const formatDate = (date) => date.toISOString().split("T")[0];

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
        <UserInfoForm />
      </div>
    </div>
  );
}
const FormField = ({ label, name, children }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    {children}
  </div>
);
const UserInfoForm = () => {
  // ⭐️ 1. 현재 날짜 기준 20년 전 날짜를 초기값으로 설정
  const today = new Date();
  const twentyYearsAgo = new Date(today);
  // 윤달 오류 방지: setFullYear은 윤년/평년을 자동으로 보정합니다.
  twentyYearsAgo.setFullYear(today.getFullYear() - 20);
  const initialDateString = formatDate(twentyYearsAgo);
  const maxDateString = formatDate(today);

  // ⭐️ 중요: 숫자 필드의 초기값을 문자열로 설정하여 입력 멈춤 오류를 방지합니다.
  const [formData, setFormData] = useState({
    name_ko: "",
    name_ch: "",
    birthDate: initialDateString,
    birthTime: "09:00", // 기본값: 오전 9시
    workingCompany: "", // 현 직장명
    workingRegno: "", // 사업자번호
    experience: "1", // 기본값: 1년차 (문자열로 관리)
    salary: "3000", // 기본값: 3000만 원 (문자열로 관리)
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ⭐️ handleChange 수정: 모든 입력을 문자열로만 저장하여 안정성 확보
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // 모든 값을 문자열 그대로 저장
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("🚀 정보 저장 중...");
    setIsLoading(true);

    try {
      // ⭐️ 제출 시에만 숫자로 변환하여 페이로드 구성
      const payload = {
        name_ko: formData.name_ko,
        name_ch: formData.name_ch,
        birth_day: formData.birthDate,
        birth_time: formData.birthTime,
        working_company: formData.workingCompany,
        working_regno: formData.workingRegno,
        // 제출 시점에 Number() 변환 (빈 문자열은 0으로 변환됨)
        working_years: Number(formData.experience),
        current_salary: Number(formData.salary),
      };

      console.log(payload);

      // const res = await api.post("/profile/info-init", payload);
      // setMessage(`✅ 정보 등록 성공! 서버 응답: ${res.data.message}`);
      // console.log("최종 전송 데이터 (payload):", payload);
    } catch (error) {
      console.error("폼 제출 오류:", error);
      setMessage(`❌ 등록 실패: ${error.message || "서버 통신 오류"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 공통 input 스타일
  const inputStyle =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6 border-b pb-3">
        개인 및 직장 정보 입력
      </h2>

      {/* 메시지 영역 */}
      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm font-medium ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : message.startsWith("❌")
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 이름 (한글/한자) */}
        <FormField label="이름(한글)" name="name_ko">
          <input
            type="text"
            name="name_ko"
            id="name_ko"
            value={formData.name_ko}
            onChange={handleChange}
            placeholder="예: 신기학"
            required
            className={inputStyle}
          />
        </FormField>
        <FormField label="이름(한자)" name="name_ch">
          <input
            type="text"
            name="name_ch"
            id="name_ch"
            value={formData.name_ch}
            onChange={handleChange}
            placeholder="예: 申基學"
            required
            className={inputStyle}
          />
        </FormField>

        {/* 생년월일 */}
        <FormField label="생년월일" name="birthDate">
          <input
            type="date"
            name="birthDate"
            id="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            min="1930-01-01"
            max={maxDateString}
            required
            className={inputStyle}
          />
          <p className="mt-1 text-xs text-gray-500">
            초기값은 현재 기준 20년 전으로 설정됩니다.
          </p>
        </FormField>

        {/* 출생 시간 */}
        <FormField label="출생 시간" name="birthTime">
          <input
            type="time"
            name="birthTime"
            id="birthTime"
            value={formData.birthTime}
            onChange={handleChange}
            required
            className={inputStyle}
          />
          <p className="mt-1 text-xs text-gray-500">
            정확한 시(Hour)와 분(Minute)을 입력해주세요.
          </p>
        </FormField>

        {/* 현 직장명 */}
        <FormField label="현 직장명" name="workingCompany">
          <input
            type="text"
            name="workingCompany"
            id="workingCompany"
            value={formData.workingCompany}
            onChange={handleChange}
            placeholder="예: 구글 코리아"
            className={inputStyle}
          />
        </FormField>

        {/* 사업자 번호 */}
        <FormField label="직장 사업자번호" name="workingRegno">
          <input
            type="text"
            name="workingRegno"
            id="workingRegno"
            value={formData.workingRegno}
            onChange={handleChange}
            placeholder="사업자번호 10자리 (선택 사항)"
            className={inputStyle}
          />
        </FormField>

        {/* 현 직장 연차 */}
        <FormField label="현 직장 연차" name="experience">
          <select
            name="experience"
            id="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className={inputStyle}
          >
            {experienceYears.map((year) => (
              <option key={year} value={String(year)}>
                {year}년차 {year >= 30 ? "이상" : ""}
              </option>
            ))}
          </select>
        </FormField>

        {/* 연봉 (단위: 만원) */}
        <FormField label="연봉 (단위: 만 원)" name="salary">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="salary"
              id="salary"
              value={formData.salary}
              onChange={handleChange}
              min="0"
              step="100" // 100만원 단위
              required
              className={inputStyle + " w-3/4"}
            />
            <span className="text-gray-700 font-medium">만 원</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            숫자만 입력해 주세요. (예: 5000 입력 시 5천만 원)
          </p>
        </FormField>

        {/* 제출 버튼 */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isLoading ? "정보 저장 중..." : "정보 저장 및 제출"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default MainPage;

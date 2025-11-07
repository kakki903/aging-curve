import ButtonForm from "../Util/ButtonForm";

const ViewForm = ({ data }) => {
  if (!data) return null;
  // 데이터를 보기 좋게 포맷팅
  const displayItems = [
    { label: "한글 이름", value: data.name_ko },
    { label: "한자 이름", value: data.name_ch },
    { label: "생년월일", value: data.birth_day },
    { label: "출생 시간", value: data.birth_time },
    { label: "현 직장명", value: data.working_company || "미입력" },
    { label: "사업자번호", value: data.working_regno || "미입력" },
    { label: "현 직장 연차", value: `${data.working_years || 0}년차` },
    {
      label: "연봉",
      value: `${data.current_salary?.toLocaleString() || 0}만 원`,
    },
  ];

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-extrabold text-green-600 text-center mb-6 border-b pb-3">
        ✅ 등록된 프로필 정보
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        프로필 정보가 성공적으로 조회되었습니다.
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-left">
        {displayItems.map((item, index) => (
          <div key={index} className="col-span-1">
            <span className="block text-sm font-medium text-gray-500">
              {item.label}
            </span>
            <span className="block text-lg font-semibold text-gray-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <ButtonForm name="앞으로 1년" location="/predict/1year" />
      <ButtonForm name="앞으로 10년" location="/predict/10year" />
      <ButtonForm name="앞으로 평생" location="/predict/lifetime" />
    </div>
  );
};

export default ViewForm;

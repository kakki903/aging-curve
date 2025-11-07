const OpenAI = require("openai");
const openaiRepository = require("../../repositories/openai/openaiRepository");
const profileRepository = require("../../repositories/profile/profileRepository");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY_QA,
});

const PERDICTION_MODEL = "gpt-4o-mini";
const FUNCTION_NAME = "submit_prediction_report";

function createPredictionSchema(period) {
  const periodKey = period === "month" ? "month" : "year";

  const monthDescription =
    "예측 월 (예: '12월', '1월'). 현재 시점의 다음 달부터 시작하는 12개월입니다.";
  const yearDescription =
    "예측 연도 (예: '2026', '2027'). 현재 시점의 다음 해부터 시작하는 10년입니다.";

  const scoreEvalProps = (categoryDescription) => ({
    type: "object",
    description: categoryDescription,
    properties: {
      score: { type: "number", description: "100점 기준 평가 점수" },
      eval: { type: "string", description: "해당 영역에 대한 상세 평가" },
    },
    required: ["score", "eval"],
  });

  return {
    type: "object",
    properties: {
      predictions: {
        type: "array",
        description: `요청된 ${
          period === "month" ? "12개월" : "10년"
        } 예측 데이터 배열`,
        items: {
          type: "object",
          properties: {
            [periodKey]: {
              type: "string",
              description:
                period === "month" ? monthDescription : yearDescription,
            },
            person: scoreEvalProps("개인 사주(재물/능력) 평가"),
            company: scoreEvalProps("회사에서 입지(직장운) 평가"),
            love: scoreEvalProps("연애/대인관계 평가"),
            health: scoreEvalProps("건강 평가"),
            overall: {
              type: "object",
              description: "모든 요소를 결합한 최종 종합 평가",
              properties: {
                score: {
                  type: "number",
                  description: "100점 기준 최종 종합 점수",
                },
                eval: {
                  type: "string",
                  description: "모든 요소를 결합한 최종 종합 평가 (3~4줄 이상)",
                },
              },
              required: ["score", "eval"],
            },
          },
          required: [
            periodKey,
            "person",
            "company",
            "love",
            "health",
            "overall",
          ],
        },
      },
    },
    required: ["predictions"],
  };
}

const openaiService = {
  get: async (user_id) => {
    const result = await openaiRepository.get(user_id);
    return result;
  },

  createPredictionPrompt: async (user_id, period) => {
    const profile = await profileRepository.infoProfile(user_id);

    let periodStr, periodObj, periodInstruction;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];

    if (period === "month") {
      let nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      let nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      let endYear = nextYear;
      let endMonthNum = nextMonth + 3;
      while (endMonthNum > 12) {
        endMonthNum -= 12;
        endYear++;
      }

      periodStr = `현재 시점(${currentYear}년 ${currentMonth}월)의 다음 달부터 12개월간의 월별`;
      periodObj = "12개";
      const startMonth = `${nextYear}년 ${monthNames[nextMonth - 1]}`;
      const endMonth = `${endYear}년 ${monthNames[endMonthNum - 1]}`;
      periodInstruction = `### 기간 지시: predictions 배열은 ${startMonth}부터 ${endMonth}까지 순서대로 ${periodObj} 데이터를 포함해야 합니다.`;
    } else if (period === "year") {
      const startYear = currentYear + 1;
      const endYear = currentYear + 10;

      periodStr = `현재 시점(${currentYear}년)의 다음 해인 ${startYear}년부터 시작하는 10년의 년도별`;
      periodObj = "10개";
      periodInstruction = `### 기간 지시: predictions 배열은 ${startYear}년 부터 ${endYear}년 까지 순서대로 ${periodObj} 데이터를 포함해야 합니다.`;
    } else {
      throw new Error(
        "유효하지 않은 예측 타입입니다. 'month' 또는 'year'를 사용해야 합니다."
      );
    }

    if (!profile) {
      throw new Error("사용자 프로필 정보를 찾을 수 없습니다.");
    }

    return `
### 역할
사주팔자와 기업 데이터를 통합 분석하여 미래를 예측하는 전문 컨설턴트입니다. 평가(eval)는 트렌디하고 재치있는 한국어 표현을 사용하십시오.

### 분석 요구사항
1. 다음 [사용자 정보]와 [기업 정보]를 기반으로 ${periodStr} 운세를 분석합니다.
2. 기업 정보는 사업자번호를 기반으로 기업의 상승세/하락세를 분석하여 연봉의 추이와 이직 가능성에 대해서도 분석합니다.
3. company 객체의 eval에는 기업명을 직접적으로 표시하지 않고 작성합니다.
4. 분석 결과는 **person, company, love, health, overall** 이라는 5개의 영역 객체로 구분하여 제출해야 합니다.
5. 각 영역 객체에는 반드시 점수('score')와 상세 평가('eval') 필드를 포함해야 합니다.
6. 모든 5개 영역 객체의 상세 평가 필드(예: person.eval, overall.eval)는 **절대 누락 없이** 포함되어야 하며, eval 값은 항목당 **최소 한글 300자 이상의 길이로** 구체적이고 유머러스하게 서비스 제공 가능하게 서술하시오.
7. 종합 평가 객체(overall.score)는 4가지 영역(person, company, love, health)의 점수를 고려하여 산출하십시오.
8. eval 값들은 띄어쓰기가 정확해야 합니다.
${periodInstruction}

### 5가지 영역 객체 구조
1. 개인 사주(재물/능력): person.score, person.eval
2. 직장/회사 입지 (기업 전망과 결합): company.score, company.eval
3. 연애/대인관계: love.score, love.eval
4. 건강: health.score, health.eval
5. 종합 평가 (1~4번 통합): overall.score, overall.eval

### 사용자 정보
이름(한자): ${profile.name_ko || "정보 없음"}(${profile.name_ch || "정보 없음"})
생년월일: ${profile.birth_day || "정보 없음"}
출생시각: ${profile.birth_time || "정보 없음"}

### 기업 정보
재직중인 기업: ${profile.working_company || "정보 없음"}
사업자번호: ${profile.working_regno || "정보 없음"}
근무 년수: ${profile.working_years || "정보 없음"}
현재 연봉: ${profile.current_salary || "정보 없음"}
`;
  },

  generatePrediction: async (user_id, period) => {
    const profilePrompt = await openaiService.createPredictionPrompt(
      user_id,
      period
    );

    const dynamicSchema = createPredictionSchema(period);

    console.log("--- Open AI API 호출 ---");
    console.log(`요청 모델 : ${PERDICTION_MODEL}`);

    try {
      const result = await openai.chat.completions.create({
        model: PERDICTION_MODEL,
        messages: [
          {
            role: "system",
            content: `You are an expert Saju and corporate data consultant. Your ONLY job is to analyze the user data and submit a structured JSON report via the ${FUNCTION_NAME} tool. Use Korean for all generated text values. It is CRITICAL to ensure the final JSON structure strictly adheres to the schema, particularly ensuring that all five category objects (person, company, love, health, overall) are present in every prediction item, and each of these objects contains both 'score' (number) and 'eval' (long string) fields.`,
          },
          {
            role: "user",
            content: profilePrompt,
          },
        ],
        temperature: 1.0,
        tools: [
          {
            type: "function",
            function: {
              name: FUNCTION_NAME,
              description:
                "사용자의 사주 및 기업 전망 예측 보고서를 구조화된 JSON 형식으로 제출하는 함수입니다.",
              parameters: dynamicSchema,
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: {
            name: FUNCTION_NAME,
          },
        },
      });

      const toolCall = result.choices[0].message.tool_calls?.[0];

      if (toolCall && toolCall.function.name === FUNCTION_NAME) {
        const jsonString = toolCall.function.arguments;
        const predictionData = JSON.parse(jsonString);

        console.log("\n--- AI 예측 성공 (Tool Call JSON 수신) ---");
        return predictionData;
      } else {
        console.error(
          "Tool Calling 실패: 모델이 함수 호출을 수행하지 않았습니다."
        );
        throw new Error("AI 응답 구조 오류: JSON 데이터 수신에 실패했습니다.");
      }
    } catch (error) {
      console.error("\n--- OpenAI API 호출 오류 발생 ---");
      throw new Error(
        `AI 예측 요청 처리에 실패했습니다. 상세 오류: ${error.message}`
      );
    }
  },

  initPrediction: async (user_id, period) => {
    try {
      const result = await openaiService.generatePrediction(user_id, period);

      console.log("\n[최종 분석 결과]");
      console.log(JSON.stringify(result, null, 2));

      await openaiRepository.save(user_id, period, result);
      console.log("\n[DB 저장 완료]");

      return result;
    } catch (err) {
      console.error("오류 발생 : " + err.message);
      throw err;
    }
  },
};

module.exports = openaiService;

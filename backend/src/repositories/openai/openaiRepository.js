const { query, pool } = require("../../config/db"); // 트랜잭션을 위해 pool 객체 필요

const openaiRepository = {
  get: async (user_id) => {
    const sql = `
      SELECT NOW() 
    `;

    const result = await query(sql);
    console.log(result.rows[0]);
    return result.rows[0];
  },

  save: async (userId, period, result) => {
    // 1. 입력 유효성 검사 및 동적 변수 설정
    const jsonString = JSON.stringify(result);
    let tableName;
    let dateColumn;
    let dateValueFormat;

    if (period === "month") {
      tableName = '"Monthly_Prediction"';
      dateColumn = "created_month";
      dateValueFormat = "YYYYMM"; // 예: 202511
    } else if (period === "year") {
      tableName = '"Yearly_Prediction"';
      dateColumn = "created_year";
      dateValueFormat = "YYYY"; // 예: 2025
    } else {
      throw new Error(
        `Invalid period value: ${period}. Must be 'month' or 'year'.`
      );
    }

    const sql = `
            INSERT INTO ${tableName} (
                user_id,
                name_ko,
                name_ch,
                birth_day,
                birth_time,
                working_company,
                working_regno,
                working_years,
                current_salary,
                prediction_json,
                ${dateColumn}  -- 동적으로 결정된 날짜 컬럼 이름
            )
            SELECT
                user_id,
                name_ko,
                name_ch,
                birth_day,
                birth_time,
                working_company,
                working_regno,
                working_years,
                current_salary,
                $1::JSONB,
                TO_CHAR(NOW(), $2)
            FROM
                "User_Profile_Info"
            WHERE
                user_id = $3;
        `;

    try {
      const PredictionData = await query(sql, [
        jsonString,
        dateValueFormat,
        userId,
      ]);

      return PredictionData;
    } catch (error) {
      console.error(
        `[DB Error] Failed to save prediction for user ${userId} (${period}):`,
        error
      );
      throw new Error(`Database save failed (${tableName}): ${error.message}`);
    }
  },
};

module.exports = openaiRepository;

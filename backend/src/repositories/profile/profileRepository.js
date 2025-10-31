const { query, pool } = require("../../config/db"); // 트랜잭션을 위해 pool 객체 필요

const profileRepository = {
  initProfile: async (
    user_id,
    name_ko,
    name_ch,
    birth_day,
    birth_time,
    working_company,
    working_years,
    working_regno,
    current_salary
  ) => {
    const sql = `
        INSERT INTO "User_profile_info" (user_id, name_ko, name_ch, birth_day, birth_time, working_company, working_years, working_regno, current_salary, createat )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    `;
    await query(sql, [
      user_id,
      name_ko,
      name_ch,
      birth_day,
      birth_time,
      working_company,
      working_years,
      working_regno,
      current_salary,
    ]);
    // 반환 값 없음
  },
};

module.exports = profileRepository;

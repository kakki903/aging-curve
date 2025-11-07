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
        INSERT INTO "User_Profile_Info" (user_id, name_ko, name_ch, birth_day, birth_time, working_company, working_years, working_regno, current_salary, createat )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    `;
    const profileInfo = await query(sql, [
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
    return profileInfo;
  },

  infoProfile: async (user_id) => {
    const sql = `
      SELECT name_ko, name_ch, to_char(birth_day,'YYYY-MM-DD') AS birth_day, to_char(birth_time, 'HH24:MI') AS birth_time, working_company, working_years, working_regno, 
      to_char(CAST(current_salary AS INTEGER), 'FM999,999,999,990') AS current_salary, createAt
      FROM "User_Profile_Info" WHERE user_id = $1
    `;

    const result = await query(sql, [user_id]);
    return result.rows[0];
  },
};

module.exports = profileRepository;

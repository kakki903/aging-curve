const { query } = require("../config/db"); // DB 쿼리 함수

const sampleRepository = {
  // 1. 데이터 저장 (INSERT)
  createSample: async (username, userage) => {
    const sql =
      "INSERT INTO samples (username, userage) VALUES ($1, $2) RETURNING id, username, userage";
    const values = [username, userage];
    const result = await query(sql, values);
    return result.rows[0];
  },

  // 2. 전체 목록 조회 (SELECT)
  findAllSamples: async () => {
    const sql = "SELECT id, username, userage FROM samples ORDER BY id DESC";
    const result = await query(sql);
    return result.rows;
  },
};

module.exports = sampleRepository;

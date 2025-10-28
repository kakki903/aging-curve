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

  // 3. 사용자 이름(username)과 나이(userage)로 존재 여부 확인 (SELECT)
  findByUsernameAndAge: async (username, userage) => {
    // SQL 쿼리 조건에 username과 userage를 모두 사용하고, 두 값을 파라미터로 전달
    const sql = "SELECT id FROM samples WHERE username = $1 AND userage = $2";
    const result = await query(sql, [username, userage]);

    // 결과가 있으면 첫 번째 row를 반환
    return result.rows[0];
  },
};

module.exports = sampleRepository;

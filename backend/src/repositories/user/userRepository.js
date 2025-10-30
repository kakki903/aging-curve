const { query, pool } = require("../../config/db"); // 트랜잭션을 위해 pool 객체 필요

const userRepository = {
  // 1. 이메일 또는 닉네임 중복 확인 (회원가입 전 필수)
  findByEmailOrNickname: async (email, nickname) => {
    const sql = `
            SELECT user_id, is_deleted 
            FROM "Account_User" 
            WHERE email = $1 OR nickname = $2
        `;
    const result = await query(sql, [email, nickname]);
    return result.rows[0];
  },

  // 2. 트랜잭션을 사용하여 Account_User, Account_Local 동시 삽입
  createLocalUser: async (email, nickname, hashedPassword) => {
    const client = await pool.connect(); // 클라이언트 연결 (트랜잭션 시작 준비)
    try {
      await client.query("BEGIN"); // 트랜잭션 시작

      // A. Account_User 테이블에 공통 정보 삽입
      const userSql = `
                INSERT INTO "Account_User" (email, nickname) 
                VALUES ($1, $2) 
                RETURNING user_id, email, nickname
            `;
      const userResult = await client.query(userSql, [email, nickname]);
      const newUser = userResult.rows[0];
      const userId = newUser.user_id;

      // B. Account_Local 테이블에 인증 정보 삽입
      const localSql = `
                INSERT INTO "Account_Local" (user_id, password) 
                VALUES ($1, $2) 
                RETURNING user_id, is_verified
            `;
      await client.query(localSql, [userId, hashedPassword]);

      await client.query("COMMIT"); // 성공 시 트랜잭션 커밋
      return newUser;
    } catch (error) {
      await client.query("ROLLBACK"); // 에러 시 롤백 (데이터 일관성 유지)
      throw error;
    } finally {
      client.release(); // 연결 반환
    }
  },

  // 3. 이메일을 통해 로그인에 필요한 모든 정보 조회
  findByEmailWithAuth: async (email) => {
    const sql = `
        SELECT 
            a.user_id, a.email, a.nickname, a.role_type, a.is_deleted, 
            b.password, b.is_verified
        FROM "Account_User" a
        INNER JOIN "Account_Local" b ON a.user_id = b.user_id
        WHERE a.email = $1;
    `;
    const result = await query(sql, [email]);
    return result.rows[0];
  },

  // 🔑 1. 소셜 ID로 등록된 소셜 계정을 찾습니다.
  findSocialAccount: async (provider, socialId) => {
    const sql = `
        SELECT 
            AU.user_id, AU.email, AU.nickname, AU.role_type
        FROM "Account_Social" AS ASoc
        JOIN "Account_User" AS AU ON ASoc.user_id = AU.user_id
        WHERE ASoc.provider_type = $1 AND ASoc.provider_user_id = $2
        AND AU.is_deleted = FALSE
    `;
    const result = await query(sql, [provider, socialId]);
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const sql = `
      SELECT user_id FROM "Account_User" WHERE email = $1
    `;
    const result = await query(sql, [email]);
    return result.rows[0];
  },

  findByUserId: async (user_id) => {
    const sql = `
        SELECT 
            user_id, email, nickname, role_type, is_deleted
        FROM "Account_User" 
        WHERE user_id = $1;
    `;
    const result = await query(sql, [user_id]);
    return result.rows[0];
  },

  // 🔑 2. 새로운 소셜 계정을 기존 유저 또는 새 유저에 연결합니다.
  linkSocialAccount: async (userId, provider, socialId) => {
    const sql = `
        INSERT INTO "Account_Social" (user_id, provider_type, provider_user_id)
        VALUES ($1, $2, $3)
    `;
    await query(sql, [userId, provider, socialId]);
    // 반환 값 없음
  },

  createSocialUser: async (provider, socialId, email, nickname) => {
    const client = await pool.connect(); // 클라이언트 연결 (트랜잭션 시작 준비)
    try {
      await client.query("BEGIN"); // 트랜잭션 시작

      // A. Account_User 테이블에 공통 정보 삽입
      const userSql = `
                INSERT INTO "Account_User" (email, nickname) 
                VALUES ($1, $2) 
                RETURNING user_id, email, nickname
            `;
      const userResult = await client.query(userSql, [email, nickname]);
      const newUser = userResult.rows[0];
      const userId = newUser.user_id;

      // B. Account_Social 테이블에 인증 정보 삽입
      const socialsql = `
          INSERT INTO "Account_Social" (user_id, provider_type, provider_user_id)
          VALUES ($1, $2, $3)
      `;
      await client.query(socialsql, [userId, provider, socialId]);

      await client.query("COMMIT"); // 성공 시 트랜잭션 커밋
      return newUser;
    } catch (error) {
      await client.query("ROLLBACK"); // 에러 시 롤백 (데이터 일관성 유지)
      throw error;
    } finally {
      client.release(); // 연결 반환
    }
  },
};

module.exports = userRepository;

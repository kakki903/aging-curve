const { query } = require("../../config/db");

const tokenRepository = {
  // token 생성
  createToken: async (userId, token, type, expiresAt) => {
    const sql = `
            INSERT INTO "Account_Verification_Token" (token, user_id, token_type, expires_at)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, token_type) DO UPDATE SET token=$1, expires_at=$4
        `;
    await query(sql, [token, userId, type, expiresAt]);
  },
  // token 찾기
  findToken: async (token) => {
    const sql = `
        SELECT user_id, token_type, expires_at
        FROM "Account_Verification_Token"
        WHERE token = $1 AND expires_at >= NOW()
    `;
    const result = await query(sql, [token]);
    return result.rows[0];
  },
  // token 유효성
  verifyUser: async (userId) => {
    const sql = `
        UPDATE "Account_Local"
        SET is_verified = TRUE
        WHERE user_id = $1
    `;
    await query(sql, [userId]);
  },
  // token 삭제
  deleteToken: async (token) => {
    const sql = `
        DELETE FROM "Account_Verification_Token"
        WHERE Token = $1
    `;
    await query(sql, [token]);
  },
};

module.exports = tokenRepository;

import pool from "../config/database.js";

export async function createRefreshToken({ userId, hash }) {
  const [result] = await pool.execute(
    `
    INSERT INTO refresh_tokens
    (
        user_id,
        hash,
        revoked,
        created_at,
        revoked_at
    )
    VALUES (?, ?, FALSE, NOW(), NULL)
    `,
    [userId, hash]
  );

  return result.insertId;
}

export async function findRefreshTokenyUserId(userId) {
  const [rows] = await pool.execute(
    `
    SELECT id, hash
    FROM refresh_tokens
    WHERE user_id = ?
      AND revoked = FALSE
    `,
    [userId]
  );

  return rows;
}

export async function revokeRefreshToken(id) {
  const [result] = await pool.execute(
    `
    UPDATE refresh_tokens
    SET
      revoked = TRUE,
      revoked_at = NOW()
    WHERE
      id = ?
      AND revoked = FALSE
    `,
    [id]
  );

  return result.affectedRows > 0;
}
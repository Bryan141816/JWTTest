import pool from "../config/database.js";

export async function createRefreshToken({
  userId,
  hash,
  expiresAt,
}) {
  const [result] = await pool.execute(
    `
    INSERT INTO refresh_tokens
    (
      user_id,
      hash,
      revoked,
      created_at,
      expires_at,
      revoked_at
    )
    VALUES
    (
      ?,
      ?,
      FALSE,
      NOW(),
      ?,
      NULL
    )
    `,
    [userId, hash, expiresAt]
  );

  return result.insertId;
}

export async function findRefreshTokenByHash(hash) {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      user_id,
      hash,
      revoked,
      created_at,
      expires_at,
      revoked_at
    FROM refresh_tokens
    WHERE
      hash = ?
      AND expires_at > NOW()
    LIMIT 1
    `,
    [hash]
  );

  return rows[0] ?? null;
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
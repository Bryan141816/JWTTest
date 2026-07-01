import pool from "../config/database.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `,
    [email]
  );

  return rows[0] ?? null;
}
export async function findUserById(id) {
  const [rows] = await pool.execute(
    `
    SELECT *
    FROM users
    WHERE id = ?
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function createUser({
  email,
  username,
  passwordHash,
}) {
  const [result] = await pool.execute(
    `
    INSERT INTO users
    (
        email,
        user_name,
        password_hash
    )
    VALUES (?, ?, ?)
    `,
    [
      email,
      username,
      passwordHash,
    ]
  );

  return result.insertId;
}
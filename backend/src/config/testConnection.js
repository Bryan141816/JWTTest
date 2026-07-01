import pool from "./database.js";

export async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("✅ Connected to MySQL!");

    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed");
    console.error(err);
    process.exit(1);
  }
}
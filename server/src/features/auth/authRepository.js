const squel = require("squel");
const { pool } = require("../../shared/config/db");

async function findUserByUsername(username) {
  const sql = squel
    .select()
    .from("users")
    .field("user_uuid")
    .field("first_name")
    .field("last_name")
    .field("username")
    .field("user_password")
    .where("username = $1") 
    .limit(1)
    .toString();

  const { rows } = await pool.query(sql, [username]);
  return rows[0];
}

module.exports = { findUserByUsername };
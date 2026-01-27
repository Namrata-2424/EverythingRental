const { pool } = require("../../shared/config/db");
const squel = require("squel").useFlavour("postgres");

async function getAllBorrowsByLender(lenderUuid) {
  const query = squel
    .select()
    .from("tools_borrow_mapping", "b")
    .join("users", "u", "b.borrower_uuid = u.user_uuid")
    .join("tools", "t", "b.tool_uuid = t.tool_uuid")
    .where("b.lender_uuid = ?", lenderUuid)
    .field("b.borrow_uuid")
    .field("b.quantity")
    .field("b.start_date")
    .field("b.due_date")
    .field("b.return_date")
    .field("b.return_status")
    .field("u.username", "borrower_username")
    .field("t.title", "tool_title")
    .order("b.created_at", false);

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);
  return res.rows;
}

async function getBorrowById(borrowUuid) {
  const query = squel
    .select()
    .from("tools_borrow_mapping", "b")
    .join("users", "u", "b.borrower_uuid = u.user_uuid")
    .join("tools", "t", "b.tool_uuid = t.tool_uuid")
    .where("b.borrow_uuid = ?", borrowUuid)
    .field("b.borrow_uuid")
    .field("b.quantity")
    .field("b.start_date")
    .field("b.due_date")
    .field("b.return_date")
    .field("b.return_status")
    .field("u.username", "borrower_username")
    .field("u.phone_number")
    .field("t.title", "tool_title");

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);
  return res.rows[0];
}

async function markReturnApproved(borrowUuid) {
  const query = squel
    .update()
    .table("tools_borrow_mapping")
    .set("return_status", "RETURNED")
    .set("return_date", squel.str("CURRENT_DATE"))
    .where("borrow_uuid = ?", borrowUuid)
    .returning("borrow_uuid");

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);
  return res.rows[0];
}

module.exports = {
  getAllBorrowsByLender,
  getBorrowById,
  markReturnApproved,
};

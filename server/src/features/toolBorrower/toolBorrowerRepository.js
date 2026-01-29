const squel = require("squel").useFlavour("postgres");
const { pool } = require("../../shared/config/db");

async function getAllBorrowedToolsByUserId(borrowerId) {
  const query = squel
    .select()
    .field("b.borrow_uuid")
    .field("t.title")
    .field("b.quantity")
    .field("b.due_date")
    .field("b.return_status")
    .from("tools_borrow_mapping", "b")
    .join("tools", "t", "b.tool_uuid=t.tool_uuid")
    .where("b.borrower_uuid = ?", borrowerId);

  const { text, values } = query.toParam();
  const result = await pool.query(text, values);

  return result.rows;
}

async function getABorrowById(borrowerId, borrowuuid) {
  const query = squel
    .select()
    .field("t.title")
    .field("t.category")
    .field("t.description")
    .field("b.quantity", "borrowed_quantity")
    .field("b.due_date")
    .field("l.first_name", "lender_first_name")
    .field("l.last_name", "lender_last_name")
    .field("l.username", "lender_username")
    .field("l.phone_number", "lender_phone")
    .field("o.tool_description")
    .from("tools_borrow_mapping", "b")
    .join("tools", "t", "b.tool_uuid = t.tool_uuid")
    .join("users", "l", "b.lender_uuid = l.user_uuid")
    .join(
      "tool_owners",
      "o",
      "o.tool_uuid = b.tool_uuid AND o.lender_uuid = b.lender_uuid",
    )
    .where("b.borrow_uuid = ?", borrowuuid)
    .where("b.borrower_uuid = ?", borrowerId);

  const { text, values } = query.toParam();
  const result = await pool.query(text, values);

  return result.rows[0];
}

async function returnAToolById(borrowerId, borrowuuid) {
  const updateQuery = squel
    .update()
    .table("tools_borrow_mapping")
    .set("return_status", "Initiated")
    .set("return_date", squel.str("CURRENT_DATE"))
    .where("borrow_uuid = ?", borrowuuid)
    .where("borrower_uuid = ?", borrowerId)
    .where("return_status = ?", "Borrowed")
    .returning("borrow_uuid");

  const { text, values } = updateQuery.toParam();
  const result = await pool.query(text, values);

  if (result.rowCount === 0) {
    return null;
  }
  return { success: true, status: "Initiated" };
}

module.exports = {
  getAllBorrowedToolsByUserId,
  getABorrowById,
  returnAToolById,
};

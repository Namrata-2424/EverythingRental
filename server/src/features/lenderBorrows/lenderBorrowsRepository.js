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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const borrowRes = await client.query(
      `
      SELECT tool_uuid, lender_uuid, quantity, due_date
      FROM tools_borrow_mapping
      WHERE borrow_uuid = $1
        AND return_date IS NULL
        AND return_status = 'Initiated'
      FOR UPDATE
      `,
      [borrowUuid]
    );

    if (borrowRes.rowCount === 0) {
      throw new Error("Borrow record not found or already returned");
    }

    const { tool_uuid, lender_uuid, quantity, due_date } = borrowRes.rows[0];

    const status =
      new Date() > new Date(due_date)
        ? "Late Returned"
        : "Returned";

    await client.query(
      `
      UPDATE tools_borrow_mapping
      SET
        return_status = $1,
        return_date = CURRENT_DATE
      WHERE borrow_uuid = $2
      `,
      [status, borrowUuid]
    );

    await client.query(
      `
      UPDATE tool_owners
      SET quantity = quantity + $1
      WHERE tool_uuid = $2
        AND lender_uuid = $3
      `,
      [quantity, tool_uuid, lender_uuid]
    );

    await client.query("COMMIT");
    return { borrow_uuid: borrowUuid };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}


module.exports = {
  getAllBorrowsByLender,
  getBorrowById,
  markReturnApproved,
};

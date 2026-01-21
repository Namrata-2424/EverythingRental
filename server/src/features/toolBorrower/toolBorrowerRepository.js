const squel = require("squel");
const { pool } = require("../../shared/config/db");

async function getAllBorrowedToolsByUserId(borrowerId) {
  const query = squel
    .select()
    .field("t.title")
    .field("b.quantity")
    .field("b.due_date")
    .from("tools_borrow_mapping", "b")
    .join("tools", "t", "b.tool_uuid=t.tool_uuid")
    .where("b.borrower_uuid = ?", borrowerId);

  const { text, values } = query.toParam();
  const result = await pool.query(text, values);

  return result;
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the borrow record
    const borrowResult = await client.query(
      `
      SELECT
        b.tool_uuid,
        b.lender_uuid,
        b.quantity,
        b.return_status
      FROM tools_borrow_mapping b
      WHERE b.borrow_uuid = $1
        AND b.borrower_uuid = $2
      FOR UPDATE
      `,
      [borrowuuid, borrowerId],
    );

    if (borrowResult.rowCount === 0) {
      throw new Error("Borrow record not found");
    }

    const borrow = borrowResult.rows[0];

    if (borrow.return_status !== "Borrowed") {
      throw new Error("Tool has already been returned");
    }

    // Mark as returned
    await client.query(
      `
      UPDATE tools_borrow_mapping
      SET
        return_status = 'Returned',
        return_date = CURRENT_DATE
      WHERE borrow_uuid = $1
      `,
      [borrowuuid],
    );

    // Restore quantity to tool owner
    await client.query(
      `
      UPDATE tool_owners
      SET quantity = quantity + $1
      WHERE tool_uuid = $2
        AND lender_uuid = $3
      `,
      [borrow.quantity, borrow.tool_uuid, borrow.lender_uuid],
    );

    await client.query("COMMIT");

    return {
      success: true,
      message: "Tool returned successfully",
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllBorrowedToolsByUserId,
  getABorrowById,
  returnAToolById,
};

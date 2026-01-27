const squel = require("squel").useFlavour("postgres");
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateBorrowSql = `
      UPDATE tools_borrow_mapping
      SET
        return_status = 'Returned',
        return_date = CURRENT_DATE
      WHERE borrow_uuid = $1
        AND borrower_uuid = $2
        AND return_status = 'Borrowed'
      RETURNING tool_uuid, lender_uuid, quantity
    `;

    const borrowResult = await client.query(updateBorrowSql, [
      borrowuuid,
      borrowerId,
    ]);

    if (borrowResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const { tool_uuid, lender_uuid, quantity } = borrowResult.rows[0];

    const restoreQuantityQuery = squel
      .update()
      .table("tool_owners")
      .set("quantity", squel.str("quantity + ?", quantity))
      .where("tool_uuid = ?", tool_uuid)
      .where("lender_uuid = ?", lender_uuid);

    const { text, values } = restoreQuantityQuery.toParam();
    await client.query(text, values);

    await client.query("COMMIT");
    return true;
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

const squel = require("squel").useFlavour("postgres");
const { pool } = require("../../shared/config/db");

async function getAllTools() {
  const query = squel
    .select()
    .field("t.tool_uuid")
    .field("t.title")
    .field("t.category")
    .field("t.description")
    .field("SUM(o.quantity)", "total_quantity")
    .from("tools", "t")
    .join("tool_owners", "o", "o.tool_uuid=t.tool_uuid")
    .group("t.tool_uuid")
    .group("t.title")
    .group("t.category")
    .group("t.description")
    .order("t.title");

  const { text, values } = query.toParam();
  const result = await pool.query(text, values);

  return result.rows;
}

async function getAToolInfoById(tooluuid) {
  const query = squel
    .select()
    .field("t.title")
    .field("t.category")
    .field("t.description")
    .field("SUM(o.quantity)", "total_quantity")
    .field(
      `
        json_agg(
          json_build_object(
            'lender_uuid', o.lender_uuid,
            'username',u.username,
            'quantity', o.quantity,
            'start_date', o.created_at,
            'days', o.borrow_day_count,
            'tool_description', o.tool_description
            )
          )
      `,
      `lenders`,
    )
    .from("tools", "t")
    .join("tool_owners", "o", "t.tool_uuid = o.tool_uuid")
    .join("users", "u", "o.lender_uuid = u.user_uuid")
    .where("t.tool_uuid = ?", tooluuid)
    .group("t.title")
    .group("t.category")
    .group("t.description");

  const { text, values } = query.toParam();
  const result = await pool.query(text, values);

  return result.rows[0] || null;
}

async function borrowATool(
  borrowerId,
  tooluuid,
  lenderUuid,
  quantity,
  startDate,
  dueDate
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateQuantityQuery = `
      UPDATE tool_owners
      SET quantity = quantity - $1
      WHERE tool_uuid = $2
        AND lender_uuid = $3
        AND quantity >= $1
      RETURNING quantity
    `;

    const updateResult = await client.query(updateQuantityQuery, [
      quantity,
      tooluuid,
      lenderUuid,
    ]);

    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const insertBorrowQuery = squel
      .insert()
      .into("tools_borrow_mapping")
      .set("borrower_uuid", borrowerId)
      .set("lender_uuid", lenderUuid)
      .set("tool_uuid", tooluuid)
      .set("quantity", quantity)
      .set("start_date", startDate)
      .set("due_date", dueDate);

    const { text, values } = insertBorrowQuery.toParam();
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
  getAllTools,
  getAToolInfoById,
  borrowATool,
};

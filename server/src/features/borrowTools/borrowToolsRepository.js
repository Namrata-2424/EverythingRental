const squel = require("squel").useFlavour("postgres");
const { pool } = require("../../shared/config/db");

async function getAllTools() {
  const query = squel
    .select()
    .field("t.title")
    .field("t.category")
    .field("t.description")
    .field("SUM(o.quantity)", "total_quantity")
    .from("tools", "t")
    .join("tool_owners", "o", "o.tool_uuid=t.tool_uuid")
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

  return result.rows[0];
}

async function borrowATool(
  borrowerId,
  tooluuid,
  lenderUuid,
  quantity,
  startDate,
  dueDate,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const availabilityResult = await client.query(
      `
              SELECT quantity
              FROM tool_owners
              WHERE tool_uuid = $1
                AND lender_uuid = $2
              FOR UPDATE
            `,
      [tooluuid, lenderUuid],
    );

    if (availabilityResult.rowCount === 0) {
      throw new Error("Tool not found for this lender!");
    }

    const availableQuantity = availabilityResult.rows[0].quantity;

    if (availableQuantity < quantity) {
      throw new Error("Not Enough Quantity available");
    }

    await client.query(
      `
              UPDATE tool_owners
              SET quantity = quantity - $1
              WHERE tool_uuid = $2
                AND lender_uuid = $3
            `,
      [quantity, tooluuid, lenderUuid],
    );

    await client.query(
      `
      INSERT INTO tools_borrow_mapping (
        borrower_uuid,
        lender_uuid,
        tool_uuid,
        quantity,
        start_date,
        due_date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [borrowerId, lenderUuid, tooluuid, quantity, startDate, dueDate],
    );

    await client.query("COMMIT");

    return {
      success: true,
      message: "Tool borrowed successfully",
    };
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

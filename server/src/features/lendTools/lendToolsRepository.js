const { pool } = require("../../shared/config/db");
const squel = require("squel").useFlavour("postgres");

async function createTool(toolData) {
  const query = squel
    .insert()
    .into("tools")
    .set("title", toolData.title)
    .set("category", toolData.category)
    .set("description", toolData.description || null)
    .returning("tool_uuid, title, category");

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);
  return res.rows[0];
}

async function createToolOwner(lenderUuid, toolUuid, ownerData) {
  const query = squel
    .insert()
    .into("tool_owners")
    .set("lender_uuid", lenderUuid)
    .set("tool_uuid", toolUuid)
    .set("quantity", ownerData.quantity);

  if (
    ownerData.borrow_day_count !== undefined &&
    ownerData.borrow_day_count !== null
  ) {
    if (ownerData.borrow_day_count <= 0) {
      throw new Error("Borrow day count must be greater than 0");
    }
    query.set("borrow_day_count", ownerData.borrow_day_count);
  }

  query.returning("lend_uuid, quantity, borrow_day_count");

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);
  return res.rows[0];
}
async function isToolCurrentlyBorrowed(toolUuid) {
  const query = squel
    .select()
    .from("tools_borrow_mapping")
    .where("tool_uuid = ?", toolUuid)
    .where("return_date IS NULL");

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);

  return res.rowCount > 0;
}

async function deleteToolOwner(toolUuid) {
  const query = squel
    .delete()
    .from("tool_owners")
    .where("tool_uuid = ?", toolUuid);

  const { text, values } = query.toParam();
  await pool.query(text, values);
}

async function deleteTool(toolUuid) {
  const query = squel.delete().from("tools").where("tool_uuid = ?", toolUuid);

  const { text, values } = query.toParam();
  await pool.query(text, values);
}

async function getToolByUuid(toolUuid) {
  const query = squel
    .select()
    .from("tools", "t")
    .join("tool_owners", "owner", "t.tool_uuid = owner.tool_uuid")
    .where("t.tool_uuid = ?", toolUuid)
    .field("t.tool_uuid")
    .field("t.title")
    .field("t.category")
    .field("t.description")
    .field("owner.quantity")
    .field("owner.borrow_day_count");

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);
  return res.rows[0];
}

async function getAllToolsByLender(lenderUuid) {
  const query = squel
    .select()
    .from("tools", "t")
    .join("tool_owners", "owner", "t.tool_uuid = owner.tool_uuid")
    .where("owner.lender_uuid = ?", lenderUuid)
    .field("t.tool_uuid")
    .field("t.title")
    .field("t.category")
    .field("t.description")
    .field("owner.quantity")
    .field("owner.borrow_day_count")
    .order("t.created_at", false);

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);
  return res.rows;
}

async function updateToolOwner(toolUuid, data) {
  const query = squel
    .update()
    .table("tool_owners")
    .where("tool_uuid = ?", toolUuid);

  let hasUpdate = false;

  if (data.quantity !== undefined) {
    if (data.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    query.set("quantity", data.quantity);
    hasUpdate = true;
  }

  if (data.borrow_day_count !== undefined) {
    if (data.borrow_day_count <= 0) {
      throw new Error("Borrow day count must be greater than 0");
    }
    query.set("borrow_day_count", data.borrow_day_count);
    hasUpdate = true;
  }

  if (!hasUpdate) return null;

  query.returning("tool_uuid, quantity, borrow_day_count");

  const { text, values } = query.toParam();
  const res = await pool.query(text, values);
  return res.rows[0];
}

module.exports = {
  createTool,
  createToolOwner,
  deleteToolOwner,
  deleteTool,
  getToolByUuid,
  getAllToolsByLender,
  updateToolOwner,
  isToolCurrentlyBorrowed,
};

const squel = require("squel").useFlavour("postgres");

async function createTool(client, toolData) {
  const q = squel
    .insert()
    .into("tools")
    .set("title", toolData.title)
    .set("category", toolData.category)
    .set("description", toolData.description || null)
    .returning("tool_uuid, title, category");

  const { text, values } = q.toParam();
  const res = await client.query(text, values);
  return res.rows[0];
}

async function createToolOwner(client, lenderUuid, toolUuid, ownerData) {
  const q = squel
    .insert()
    .into("tool_owners")
    .set("lender_uuid", lenderUuid)
    .set("tool_uuid", toolUuid)
    .set("quantity", ownerData.quantity)
    .returning("lend_uuid, quantity, borrow_day_count");

  const { text, values } = q.toParam();
  const res = await client.query(text, values);
  return res.rows[0];
}

async function deleteToolOwner(client, toolUuid) {
  const q = squel.delete().from("tool_owners").where("tool_uuid = ?", toolUuid);

  const { text, values } = q.toParam();
  await client.query(text, values);
}

async function deleteTool(client, toolUuid) {
  const q = squel.delete().from("tools").where("tool_uuid = ?", toolUuid);

  const { text, values } = q.toParam();
  await client.query(text, values);
}

async function getToolByUuid(client, toolUuid) {
  const q = squel
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

  const { text, values } = q.toParam();
  const res = await client.query(text, values);

  return res.rows[0];
}

async function getAllToolsByLender(client, lenderUuid) {
  const q = squel
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

  const { text, values } = q.toParam();
  const res = await client.query(text, values);

  return res.rows;
}

async function updateToolOwner(client, toolUuid, data) {
  const q = squel
    .update()
    .table("tool_owners")
    .where("tool_uuid = ?", toolUuid);

  let hasUpdate = false;

  if (data.quantity !== undefined) {
    if (data.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    q.set("quantity", data.quantity);
    hasUpdate = true;
  }

  if (data.borrow_day_count !== undefined) {
    if (data.borrow_day_count <= 0) {
      throw new Error("Borrow day count must be greater than 0");
    }
    q.set("borrow_day_count", data.borrow_day_count);
    hasUpdate = true;
  }

  if (!hasUpdate) return null;

  q.returning("tool_uuid, quantity, borrow_day_count");

  const { text, values } = q.toParam();
  const res = await client.query(text, values);

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
};

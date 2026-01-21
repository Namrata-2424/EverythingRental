const { pool } = require("../../shared/config/db");
const lendToolsRepository = require("./lendToolsRepository");

async function listATool(lenderUuid, toolData, ownerData) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tool = await lendToolsRepository.createTool(client, toolData);

    const toolOwner = await lendToolsRepository.createToolOwner(
      client,
      lenderUuid,
      tool.tool_uuid,
      ownerData,
    );

    await client.query("COMMIT");

    return { tool, toolOwner };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function deleteAListedTool(toolUuid) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await lendToolsRepository.deleteToolOwner(client, toolUuid);

    await lendToolsRepository.deleteTool(client, toolUuid);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function getaListedTool(toolUuid) {
  const client = await pool.connect();
  try {
    return await lendToolsRepository.getToolByUuid(client, toolUuid);
  } finally {
    client.release();
  }
}

async function getAllListedTools(lenderUuid) {
  const client = await pool.connect();
  try {
    return await lendToolsRepository.getAllToolsByLender(client, lenderUuid);
  } finally {
    client.release();
  }
}

async function updateAListedTool(toolUuid, updateData) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updated = await lendToolsRepository.updateToolOwner(
      client,
      toolUuid,
      updateData,
    );

    if (!updated) {
      throw new Error("Tool not found");
    }

    await client.query("COMMIT");
    return updated;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  listATool,
  deleteAListedTool,
  getaListedTool,
  getAllListedTools,
  updateAListedTool,
};

const lendToolsRepository = require("./lendToolsRepository");

async function listATool(lenderUuid, toolData, ownerData) {
  const tool = await lendToolsRepository.createTool(toolData);

  const toolOwner = await lendToolsRepository.createToolOwner(
    lenderUuid,
    tool.tool_uuid,
    ownerData
  );

  return { tool, toolOwner };
}

async function deleteAListedTool(toolUuid) {
  const isBorrowed =
    await lendToolsRepository.isToolCurrentlyBorrowed(toolUuid);

  if (isBorrowed) {
    throw new Error(
      "Tool cannot be deleted because it is currently borrowed"
    );
  }

  await lendToolsRepository.deleteToolOwner(toolUuid);
  await lendToolsRepository.deleteTool(toolUuid);
}


async function getaListedTool(toolUuid) {
  return await lendToolsRepository.getToolByUuid(toolUuid);
}

async function getAllListedTools(lenderUuid) {
  return await lendToolsRepository.getAllToolsByLender(lenderUuid);
}

async function updateAListedTool(toolUuid, updateData) {
  const updated = await lendToolsRepository.updateToolOwner(
    toolUuid,
    updateData
  );

  if (!updated) {
    throw new Error("Tool not found");
  }

  return updated;
}

module.exports = {
  listATool,
  deleteAListedTool,
  getaListedTool,
  getAllListedTools,
  updateAListedTool,
};

const borrowToolsRepository = require("./borrowToolsRepository");

async function getAllTools() {
  return borrowToolsRepository.getAllTools();
}

async function getAToolInfo(tooluuid) {
  const tool = await borrowToolsRepository.getAToolInfoById(tooluuid);

  if (!tool) {
    throw new Error("Tool not found");
  }

  return tool;
}

async function borrowATool(
  borrowerId,
  tooluuid,
  lenderuuid,
  quantity,
  startDate,
  dueDate,
) {
  const result = await borrowToolsRepository.borrowATool(
    borrowerId,
    tooluuid,
    lenderuuid,
    quantity,
    startDate,
    dueDate,
  );

  if (!result) {
    throw new Error("Not enough quantity available or invalid tool");
  }

  return {
    success: true,
    message: "Tool borrowed successfully",
  };
}

module.exports = {
  getAllTools,
  getAToolInfo,
  borrowATool,
};

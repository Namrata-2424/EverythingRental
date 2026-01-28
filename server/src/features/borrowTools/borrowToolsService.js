const borrowToolsRepository = require("./borrowToolsRepository");
const { toolUuid } = require("../../validators");
const { borrowTool } = require("../../validators");

async function getAllTools() {
  return borrowToolsRepository.getAllTools();
}

async function getAToolInfo(tooluuid) {
  const { error } = toolUuid.validate({ tooluuid });
  if (error) throw new Error(error.details[0].message);

  const tool = borrowToolsRepository.getAToolInfoById(tooluuid);
  if (!tool) throw new Error("Tool not Found!");

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
  const { error } = borrowTool.validate({
    borrowerId,
    tooluuid,
    lenderuuid,
    quantity,
    startDate,
    dueDate,
  });
  if(error) throw new Error(error.details[0].message);

  const result = borrowToolsRepository.borrowATool(
    borrowerId,
    tooluuid,
    lenderuuid,
    quantity,
    startDate,
    dueDate,
  );

  if(!result) throw new Error("Not enough quantity available or invalid tool");

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

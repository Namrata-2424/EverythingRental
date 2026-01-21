const borrowToolsRepository = require("./borrowToolsRepository");

async function getAllTools() {
  return borrowToolsRepository.getAllTools();
}

async function getAToolInfo(tooluuid) {
  return borrowToolsRepository.getAToolInfoById(tooluuid);
}

async function borrowATool(
  borrowerId,
  tooluuid,
  lenderuuid,
  quantity,
  startDate,
  dueDate,
) {
  return borrowToolsRepository.borrowATool(
    borrowerId,
    tooluuid,
    lenderuuid,
    quantity,
    startDate,
    dueDate,
  );
}

module.exports = {
  getAllTools,
  getAToolInfo,
  borrowATool,
};

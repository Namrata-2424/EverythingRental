const toolBorrowerRepository = require("./toolBorrowerRepository");

async function getAllBorrowedTools(borrowerId) {
  return toolBorrowerRepository.getAllBorrowedToolsByUserId(borrowerId);
}

async function getABorrow(borrowerId, borrowuuid) {
  return toolBorrowerRepository.getABorrowById(borrowerId, borrowuuid);
}

async function returnATool(borrowerId, borrowuuid) {
  return toolBorrowerRepository.returnAToolById(borrowerId, borrowuuid);
}

module.exports = {
  getAllBorrowedTools,
  getABorrow,
  returnATool,
};

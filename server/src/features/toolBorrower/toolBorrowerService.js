const toolBorrowerRepository = require("./toolBorrowerRepository");

async function getAllBorrowedTools(borrowerId) {
  return toolBorrowerRepository.getAllBorrowedToolsByUserId(borrowerId);
}

async function getABorrow(borrowerId, borrowuuid) {
  const borrow = await toolBorrowerRepository.getABorrowById(
    borrowerId,
    borrowuuid
  );

  if (!borrow) {
    throw new Error("Borrow record not found");
  }

  return borrow;
}

async function returnATool(borrowerId, borrowuuid) {
  const result = await toolBorrowerRepository.returnAToolById(
    borrowerId,
    borrowuuid
  );

  if (!result) {
    throw new Error("Tool already returned or invalid borrow");
  }

  return {
    success: true,
    message: "Tool returned successfully",
  };
}

module.exports = {
  getAllBorrowedTools,
  getABorrow,
  returnATool,
};

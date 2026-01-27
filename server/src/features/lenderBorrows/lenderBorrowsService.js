const lenderBorrowsRepository = require("./lenderBorrowsRepository");

async function getAllBorrowersForALender(lenderUuid) {
  return await lenderBorrowsRepository.getAllBorrowsByLender(lenderUuid);
}

async function getBorrowById(borrowUuid) {
  return await lenderBorrowsRepository.getBorrowById(borrowUuid);
}

async function approveReturn(borrowUuid) {
  const updated =
    await lenderBorrowsRepository.markReturnApproved(borrowUuid);

  if (!updated) {
    throw new Error("Borrow record not found");
  }

  return updated;
}

module.exports = {
  getAllBorrowersForALender,
  getBorrowById,
  approveReturn,
};

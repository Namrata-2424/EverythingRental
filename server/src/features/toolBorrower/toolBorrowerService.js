const toolBorrowerRepository = require("./toolBorrowerRepository");
const {returnTool} = require("../../validators");

async function getAllBorrowedTools(borrowerId) {
  return toolBorrowerRepository.getAllBorrowedToolsByUserId(borrowerId);
}

async function getABorrow(borrowerId, borrowuuid) {
  const {error} = returnTool.validate({borrowerId,borrowuuid});
  if(error) throw new Error(error.details[0].message);

  const borrow = await toolBorrowerRepository.getABorrowById(
    borrowerId,
    borrowuuid
  );

  if (!borrow) throw new Error("Borrow record not found");

  return borrow;
}

async function returnATool(borrowerId, borrowuuid) {
  const { error } = returnTool.validate({ borrowerId, borrowuuid });
  if (error) throw new Error(error.details[0].message);

  const result = await toolBorrowerRepository.returnAToolById(
    borrowerId,
    borrowuuid
  );

  if (!result) throw new Error("Tool already returned or invalid borrow");

  return { success: true, message: "Tool returned successfully" };
}

module.exports = {
  getAllBorrowedTools,
  getABorrow,
  returnATool,
};

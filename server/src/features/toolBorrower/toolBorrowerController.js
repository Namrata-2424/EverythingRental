const toolBorrowerService = require("./toolBorrowerService");

async function getAllBorrowedTools(req, res) {
  try {
    const borrowerId = req.user.userId;
    const tools = await toolBorrowerService.getAllBorrowedTools(borrowerId);

    return res.status(200).json(tools);
  } catch (err) {
    return res.status(500).json({
      message: "Could not get Borrowed Tools!",
    });
  }
}

async function getABorrow(req, res) {
  try {
    const borrowerId = req.user.userId;
    const { borrowuuid } = req.params;

    const result = await toolBorrowerService.getABorrow(borrowerId, borrowuuid);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to Fetch Borrow Details!",
    });
  }
}

async function returnATool(req, res) {
  try {
    const borrowerId = req.user.userId;
    const { borrowuuid } = req.params;

    const result = await toolBorrowerService.returnATool(
      borrowerId,
      borrowuuid,
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to Return the Tool! Try again later!",
    });
  }
}

module.exports = {
  getAllBorrowedTools,
  getABorrow,
  returnATool,
};

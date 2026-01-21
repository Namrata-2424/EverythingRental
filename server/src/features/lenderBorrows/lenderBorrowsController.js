const lenderBorrowsService = require("./lenderBorrowsService");

async function getAllBorrowersForALender(req, res) {
  try {
    const lenderUuid = req.user.userId;

    const borrows =
      await lenderBorrowsService.getAllBorrowersForALender(
        lenderUuid
      );

    return res.status(200).json(borrows);

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
}

async function getBorrowById(req, res) {
  try {
    const { borrow_uuid } = req.params;

    const borrow =
      await lenderBorrowsService.getBorrowById(borrow_uuid);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found"
      });
    }

    return res.status(200).json(borrow);

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
}

async function approveReturn(req, res) {
  try {
    const { borrow_uuid } = req.params;

    await lenderBorrowsService.approveReturn(borrow_uuid);

    return res.status(200).json({
      message: "Return approved successfully"
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
}

module.exports = {
  getAllBorrowersForALender,
  getBorrowById,
  approveReturn
};

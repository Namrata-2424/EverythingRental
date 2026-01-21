const express = require("express");
const router = express.Router();

const {
  getAllBorrowersForALender,
  getBorrowById,
  approveReturn,
} = require("./lenderBorrowsController");

router.get("/borrows", getAllBorrowersForALender);

router.get("/borrows/:borrow_uuid", getBorrowById);

router.post(
  "/borrows/:borrow_uuid/approve-return",
  approveReturn,
);

module.exports = router;

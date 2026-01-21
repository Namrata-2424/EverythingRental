const express = require("express");
const router = express.Router();
const toolBorrowerController = require("./toolBorrowerController");

router.get("/", toolBorrowerController.getAllBorrowedTools);
router
  .get("/:borrowuuid", toolBorrowerController.getABorrow)
  .post("/:borrowuuid", toolBorrowerController.returnATool);

module.exports = router;
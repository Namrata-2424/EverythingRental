const express = require("express");
const router = express.Router();
const authenticate = require("../../shared/middleware/authenticateToken");
const borrowToolsController = require("./borrowToolsController");

router.get("/", borrowToolsController.getAllTools);

router
  .get("/:tooluuid", borrowToolsController.getAToolInfo)
  .post("/:tooluuid", authenticate, borrowToolsController.borrowATool);

module.exports = router;

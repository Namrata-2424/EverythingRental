const express = require("express");
const router = express.Router();

const {
  listATool,
  deleteAListedTool,
  getaListedTool,
  getAllListedTools,
  updateAListedTool,
} = require("./lendToolsController");

router.post("/tools", listATool);
router.delete("/tools/:tool_uuid", deleteAListedTool);
router.get("/tools/:tool_uuid", getaListedTool);
router.get("/tools", getAllListedTools);
router.patch("/tools/:tool_uuid", updateAListedTool);

module.exports = router;

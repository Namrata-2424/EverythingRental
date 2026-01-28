const borrowToolsService = require("./borrowToolsService");

async function getAllTools(req, res) {
  try {
    const tools = await borrowToolsService.getAllTools();
    return res.status(200).json(tools);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

async function getAToolInfo(req, res) {
  try {
    const { tooluuid } = req.params;
    const tool = await borrowToolsService.getAToolInfo(tooluuid);

    if (!tool) {
      return res.status(400).json("Failed to Fetch Tool Info!");
    }

    return res.status(200).json(tool);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get Tool!",
    });
  }
}

async function borrowATool(req, res) {
  try {
    const borrowerId = req.user.userId;
    const { tooluuid } = req.params;
    const { lenderuuid, quantity, startDate, dueDate } = req.body;

    const result = await borrowToolsService.borrowATool(
      borrowerId,
      tooluuid,
      lenderuuid,
      quantity,
      startDate,
      dueDate,
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      messge: "Failed to Borrow!",
    });
  }
}

module.exports = {
  getAllTools,
  getAToolInfo,
  borrowATool,
};

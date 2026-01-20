const lendToolsService = require("./lendToolsService");

async function listATool(req, res) {
  try {
    const lenderUuid = req.user.userId;
    const { title, category, description, quantity } = req.body;

    if (!title || !category || !quantity) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const result = await lendToolsService.listATool(
      lenderUuid,
      { title, category, description },
      { quantity },
    );

    return res.status(201).json({
      message: "Tool listed successfully",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

async function deleteAListedTool(req, res) {
  try {
    const { tool_uuid } = req.params;

    if (!tool_uuid) {
      return res.status(400).json({
        message: "Tool UUID is required",
      });
    }

    await lendToolsService.deleteAListedTool(tool_uuid);

    return res.status(200).json({
      message: "Tool listing deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

async function getaListedTool(req, res) {
  try {
    const { tool_uuid } = req.params;

    if (!tool_uuid) {
      return res.status(400).json({
        message: "Tool UUID is required",
      });
    }

    const tool = await lendToolsService.getaListedTool(tool_uuid);

    if (!tool) {
      return res.status(404).json({
        message: "Tool not found",
      });
    }

    return res.status(200).json(tool);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

async function getAllListedTools(req, res) {
  try {
    const lenderUuid = req.user.userId;

    const tools = await lendToolsService.getAllListedTools(lenderUuid);

    return res.status(200).json(tools);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

async function updateAListedTool(req, res) {
  try {
    const { tool_uuid } = req.params;
    const { quantity, borrow_day_count } = req.body;

    if (!tool_uuid) {
      return res.status(400).json({
        message: "Tool UUID is required",
      });
    }

    if (quantity === undefined && borrow_day_count === undefined) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const updatedTool = await lendToolsService.updateAListedTool(tool_uuid, {
      quantity,
      borrow_day_count,
    });

    return res.status(200).json({
      message: "Tool updated successfully",
      data: updatedTool,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

module.exports = {
  listATool,
  deleteAListedTool,
  getaListedTool,
  getAllListedTools,
  updateAListedTool,
};

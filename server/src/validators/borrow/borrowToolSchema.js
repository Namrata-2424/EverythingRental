const Joi = require("joi");
const uuid = require("../common/uuidSchema");
const dateRange = require("../common/dateRangeSchema");

module.exports = Joi.object({
  borrowerId: uuid.required(),
  tooluuid: uuid.required(),
  lenderuuid: uuid.required(),
  quantity: Joi.number().integer().min(1).required(),
  ...dateRange,
});
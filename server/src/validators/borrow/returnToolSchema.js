const Joi = require("joi");
const uuid = require("../common/uuidSchema");

module.exports = Joi.object({
  borrowerId: uuid.required(),
  borrowuuid: uuid.required(),
});

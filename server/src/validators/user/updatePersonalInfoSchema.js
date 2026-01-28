const Joi = require("joi");

module.exports = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  username: Joi.string().min(3).max(50).optional(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).optional(),
}).min(1);

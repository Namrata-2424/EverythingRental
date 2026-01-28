const Joi = require("joi");
const uuid = require("../common/uuidSchema");

module.exports = Joi.object({
  addressId: uuid.required(),
  city: Joi.string().min(1).max(100).optional(),
  locality: Joi.string().min(1).max(150).optional(),
  pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
  stateName: Joi.string().min(1).max(100).optional(),
  country: Joi.string().min(1).max(100).optional(),
}).min(2);

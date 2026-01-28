const Joi = require("joi");
const uuid = require("../common/uuidSchema");

module.exports = Joi.object({
    tooluuid : uuid.required()
})
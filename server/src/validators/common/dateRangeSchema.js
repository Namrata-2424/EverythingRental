const Joi = require("joi");

module.exports = {
    startDate:Joi.date().required(),
    dueDate:Joi.date().greater(Joi.ref("startDate")).required()
}
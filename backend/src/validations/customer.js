const Joi = require('joi');

const checkDeviceValidation = ({ orderId, authCode }) => {
    const schema = Joi.object().keys({
        orderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
            "string.base": `orderId should be a type of String`,
            "string.empty": `orderId cannot be an empty field`,
            "any.required": `orderId is required.`,
            "string.pattern.base": `Invalid orderId format`,
        }),
        authCode: Joi.string().required().messages({
            "string.base": `authCode should be a type of String`,
            "string.empty": `authCode cannot be an empty field`,
            "any.required": `authCode is required.`,
        }),
    });

    const { value, error } = schema.validate({ orderId, authCode }, { escapeHtml: true });
    return { value, error };
};
module.exports = { checkDeviceValidation };
const Joi = require('joi');

const authValidation = ({ email, password }) => {
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email().required()
            .messages({
                "string.base": `email should be a type of String`,
                "string.empty": `email cannot be an empty field`,
                "string.email": `Please enter Correct email ["com", "net", "in", "co"]`,
                "any.required": `email is required.`,
            }),
        password: Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/).min(6).required()
            .messages({
                "string.base": `password should be a type of Text`,
                "string.pattern.base": `password must be minimum 6 Characters with one special character and one number! `,
                "string.empty": `password cannot be an empty field`,
                "any.required": `password is required.`,
            })
    })
    const { value, error } = joiSchema.validate({ email, password }, { escapeHtml: true })
    return { value, error }
}

module.exports = { authValidation };
// Validation
const Joi = require('joi')

const registerValidation = data => {
    const schema = Joi.object().keys({
        name : Joi.string().min(3).required(),
        email : Joi.string().required().email(),
        password : Joi.string().min(8).required()

    })
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object().keys({
        email : Joi.string().required().email(),
        password : Joi.string().min(8).required()

    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
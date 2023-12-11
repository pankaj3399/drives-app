const jwt = require('jsonwebtoken');
const projectConfig = require('../config')

const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user._email
    }, projectConfig?.jwt?.key, {
        expiresIn: projectConfig?.jwt?.expire
    })
}

module.exports = generateToken;
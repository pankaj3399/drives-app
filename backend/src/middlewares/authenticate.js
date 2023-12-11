const { findAdmin } = require('../services/admin');
const jwt = require('jsonwebtoken');
const projectConfig= require('../config')

const adminAuthentication = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.header('Authorization');

    if (!token) {
        return res.status(401).send({ err: "A token is required for authentication" });
    }
    try {
        const decoded = jwt.verify(token, projectConfig?.jwt?.key);
        const admin = await findAdmin({ _id: decoded?._id });
        if (!admin) return res.status(403).send({ err: "Invalid Token" });
        req.admin = decoded;
    } catch (err) {
        console.log(err)
        return res.status(403).send({ err: "Invalid Token" });
    }
    return next();
}
module.exports = adminAuthentication;
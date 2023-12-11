const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const startingMiddleware = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors({
        origin: true,
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', 'DELETE'],
        credentials: true,
        optionSuccessStatus: 200
    }));
    app.use(function (err, req, res, next) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).send(err.message || 'Something went wrong')
    })
}
module.exports = startingMiddleware;
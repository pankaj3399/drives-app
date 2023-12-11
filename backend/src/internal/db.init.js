const projectConfig = require('../config')
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectToDatabase = async () => {
    // Mongoose Connection Information
    mongoose.connect(projectConfig.db.url)

    mongoose.connection.on('connected', () => {
        console.info('Success! Connected to Database.');
    });

    mongoose.connection.on('disconnected', () => {
        console.error('!!!!!!!!!! Database Disconnected !!!!!!!!!!');
    });

    mongoose.connection.on('reconnected', () => {
        console.warn('!!!!!!!!!! Database Reconnected  !!!!!!!!!!');
    });

    mongoose.connection.on('error', (error) => {
        console.error('Failed! Database connection failed. \n', error);
    });
};

module.exports = connectToDatabase;
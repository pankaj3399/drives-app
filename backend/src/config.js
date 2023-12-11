const projectConfig = {
    app: {
        port: parseInt(process.env.PORT) || 3001,
    },
    db: {
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017/hard-drive'
    },
    jwt: {
        key: process.env.JWT_SECRET_KEY || 'secret',
        expire: process.env.JWT_COOKIE_EXPIRES_IN || '7d'
    },
    email: {
        address: process.env.EMAIL_ADDRESS,
        password: process.env.EMAIL_PASSWORD,
    },
};

module.exports = projectConfig;
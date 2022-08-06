const mongoose = require('mongoose');
const logger = require('./logger');

async function connectToDB() {
    await mongoose
        .connect(process.env.MONGODB || 'mongodb://0.0.0.0:27017/uploadFile')
        .then(() => {
            logger.info('Connected to mongo database');
        })
        .catch((err) => {
            logger.warn(err.message);
        });
}

module.exports = connectToDB;

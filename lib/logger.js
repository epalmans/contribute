'use strict';

const colors = require('colors/safe');

const logger = {
    info: console.log,
    success: (message) => logger.info(colors.green(message)),
    warn: (message) => logger.info(colors.yellow(message)),
    error: (message) => logger.info(colors.red(message)),

    grey: (message) => logger.info(colors.grey(message))
};

module.exports = logger;
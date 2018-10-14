'use strict';

const fs = require('fs');

module.exports = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(JSON.parse(data));
        });
    });
}
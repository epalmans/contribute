'use strict';

const localJsonFile = require('./localJsonFle');
const rpn = require('request-promise-native');

module.exports = () => {
    return localJsonFile('composer.json')
        .then((obj) => {
            const composerPackages = Object.keys(obj['require'] || []).concat(Object.keys(obj['require-dev'] || []));
            const packagistSearches = composerPackages.map((p) => searchPackagist(p));
            return Promise.all(packagistSearches);
        })
        .catch((err) => Promise.all([]))
}

function searchPackagist(packageName) {
    return rpn(`https://packagist.org/packages/${packageName}.json`, {json: true})
        .then((body) => resp(packageName,body.package.repository))
        .catch((err) => resp(packageName, null));
}

function resp(name, githubUrl) {
    return {
        type: 'Composer package',
        name,
        githubUrl
    };
}
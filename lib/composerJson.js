'use strict';

const localJsonFile = require('./localJsonFle'),
 rpn = require('request-promise-native'),
 github = require('./github');

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
        .then((body) => resp(packageName, github.infoFromUrl(body.package.repository)))
        .catch((err) => resp(packageName, null));
}

function resp(name, github) {
    return {
        type: 'Composer package',
        name,
        github
    };
}


'use strict';

const localJsonFile = require('./localJsonFle');
const rpn = require('request-promise-native');

module.exports = () => {
    return localJsonFile('package.json')
        .then((obj) => {
            const npmPackages = Object.keys(obj['dependencies'] || []).concat(Object.keys(obj['devDependencies'] || []));
            const npmSearches = npmPackages.map((p) => searchNpmRegistry(p));
            return Promise.all(npmSearches);
        })
        .catch((err) => Promise.all([]))
}

function searchNpmRegistry(packageName) {
    return rpn(`https://registry.npmjs.org/${packageName}`, {json: true})
        .then((body) => resp(packageName, extractGithubUrl(body.repository)))
        .catch((err) => resp(packageName, null));
}

function extractGithubUrl(npmRepo) {
    const firstPart = npmRepo.url.indexOf('github.com');
    const lastPart = npmRepo.url.indexOf('.git');

    let urlPath = npmRepo.url.slice(firstPart, lastPart < 0 ? undefined : lastPart);
    urlPath = urlPath.split('/').slice(0, 3).join('/');

    return `https://${urlPath}`;
}

function resp(name, githubUrl) {
    return {
        type: 'NPM package',
        name,
        githubUrl
    };
}
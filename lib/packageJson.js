'use strict';

const localJsonFile = require('./localJsonFle'),
 rpn = require('request-promise-native'),
 github = require('./github');

module.exports = () => {
    return localJsonFile('package.json')
        .then(obj => {
            const npmPackages = Object.keys(obj['dependencies'] || []).concat(Object.keys(obj['devDependencies'] || []));
            const npmSearches = npmPackages.map((p) => searchNpmRegistry(p));
            return Promise.all(npmSearches);
        })
        .catch(() => Promise.all([]))
}

function searchNpmRegistry(packageName) {
    return rpn(`https://registry.npmjs.org/${packageName}`, {json: true})
        .then(body => resp(packageName, extractGithubInfo(body.repository)))
        .catch(() => resp(packageName, null));
}

function extractGithubInfo(npmRepo) {
    const firstPart = npmRepo.url.indexOf('github.com');
    const lastPart = npmRepo.url.indexOf('.git');

    let urlPath = npmRepo.url.slice(firstPart, lastPart < 0 ? undefined : lastPart);
    urlPath = urlPath.split('/').slice(0, 3).join('/');

    return github.infoFromUrl(`https://${urlPath}`);
}

function resp(name, github) {
    return {
        type: 'NPM package',
        name,
        github
    };
}
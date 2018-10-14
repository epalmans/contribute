'use strict';

const localJsonFile = require('./localJsonFle');
const rpn = require('request-promise-native');

exports.helpwanted = (info, options) => search(info, 'help wanted', options);

const apiRepoUrl = (repoUrl) => repoUrl.replace('github.com', 'api.github.com/repos');

function search(info, label, options) {
    const githubRepoIssuesUrl = `${apiRepoUrl(info.githubUrl)}/issues?labels=${encodeURIComponent(label)}&since=${options.since}`;
    
    const headers = { 'User-agent': 'contribute' };
    if (options.auth)
        headers.Authorization = "Basic " + new Buffer(options.auth.username + ":" + options.auth.password).toString("base64");

    return rpn(githubRepoIssuesUrl, { json: true, headers });
}
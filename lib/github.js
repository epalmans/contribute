'use strict';

const rpn = require('request-promise-native');

exports.helpwanted = (info, options) => searchIssues(info, 'help wanted', options);

const apiRepoUrl = (repoUrl) => repoUrl.replace('github.com', 'api.github.com/repos');

function searchIssues(info, label, options) {
    const githubRepoIssuesUrl = `${apiRepoUrl(info.github.url)}/issues?labels=${encodeURIComponent(label)}&since=${options.since}`;
    
    const headers = { 'User-agent': 'contribute' };
    if (options.auth)
        headers.Authorization = "Basic " + new Buffer(options.auth.username + ":" + options.auth.password).toString("base64");

    return rpn(githubRepoIssuesUrl, { json: true, headers });
}

exports.infoFromUrl = url => {
    const urlParts = url.replace(/\/$/, "").split('/');

    return {
        repo: urlParts.pop(),
        owner: urlParts.pop(),
        url
    };
};
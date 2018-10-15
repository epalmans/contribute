'use strict';

const colors = require('colors/safe'),
 packageJson = require('./packageJson'),
 composerJson = require('./composerJson'),
 github = require('./github');


exports.scan = (logger, options) => {
    Promise.all([gitHubInfoFor(packageJson), gitHubInfoFor(composerJson)]).then((multi) => {
        
        const all = multi.reduce((a, b) => a.concat(b), []);

        if (!all.length) {
            logger.warn('No packages used in project (current directory)');
            return;
        }

        logger.error(`\r`);
        all.forEach(item => {

            github.helpwanted(item, options).then(issues => {

                if (options.verbose) {
                    logger.grey(`GitHub repo URL: ${item.github.url}`);
                }

                if (!issues.length) {

                    if (options.verbose) {
                        logger.warn(`${item.type} "${item.name}": no issues labelled "HELP WANTED"\n`);
                    }
                    return;
                }

                logger.success(`${item.type} "${item.name}". Issues labelled "HELP WANTED":`);
                for(let issue of issues) {
                    logger.info(colors.grey(`- #${issue.number}: "${issue.title}"`, colors.cyan(`${issue.html_url}`)));
                }
                logger.info(`\r`);
                
            })
            .catch(err => {
                if (options.verbose) {
                    logger.grey(`GitHub repo URL: ${item.github.url}`);
                }
                logger.error(`Error while checking GitHub issues for ${item.type} "${item.name}"`);
                if (options.verbose) {
                    logger.error(`>>> ${err}`);   
                }
                logger.error(`\r`);
            })

        })
    })
}

function gitHubInfoFor(fn) {
    let urls = [];
    return fn().then(info => info.filter(item => {
        
        if (!item.github || !item.github.url)
            return false;

        return urls.indexOf(item.github.url) >= 0 ? false : urls.push(item.github.url);
    }));
}
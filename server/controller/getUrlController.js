var URL = require('url').URL;

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const log = require('lighthouse-logger');
var rimraf = require("rimraf");
var path = require('path');

module.exports = (req, res, next) => {
    const website = process.env.WEBSITE;
    const url = new URL(website)
    const generatedURL = `${url.protocol}//${url.hostname}${url.port && ':' + url.port}${req.url}${url.search}`;
    console.log(`Running for ${generatedURL}`)
    function launchChromeAndRunLighthouse(url, opts, config = null) {
        return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
            opts.port = chrome.port;
            return lighthouse(url, opts, config).then(results => {

                report = results.report;
                fs.writeFile("./public/something.html", report, function (fileerr) {
                    if (fileerr) {
                        return console.log(`Directory error ::> ${fileerr}`);
                    }
                });

                return chrome.kill().then(() => results.lhr)
            });
        });
    }

    const opts = {
        output: 'html',
        chromeFlags: ['--headless'],
        logLevel: 'info',
        onlyCategories: ['performance','pwa','best-practices', 'seo', 'accessibility'],
        view: true

    };

    launchChromeAndRunLighthouse(generatedURL, opts).then(results => {
        log.setLevel(opts.logLevel);
        console.log('report is done')
        // res.send("report is done")
        res.sendFile(path.join(__dirname, '../../public/something.html'))
        // res.sendFile('./public/reports/something.html');
    });
}
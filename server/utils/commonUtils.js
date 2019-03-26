const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const fs = require('fs');
var rimraf = require("rimraf");

module.exports = {
    generateChecklist: function(template, websiteURLs) {
        return template.replace('href-list', websiteURLs.map((value, index) => {
            return `<tr>
                <td>${value}</td>
                <td><a href=/webReport?type=view&url=${value}>Generate Report</a>
                <a href=/webReport?type=download&url=${value}>Download Report</a></td>
                </tr>
            `
        }).join(''));
    },
    launchChromeAndRunLighthouse: function(url, opts, callback, config = null) {
        return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
            opts.port = chrome.port;
            return lighthouse(url, opts, config).then(results => {
                report = results.report;
                callback(report);
                return chrome.kill().then(() => results.lhr)
            });
        });
    },
    writeFile: function(path, content) {
        fs.writeFile(path, content, function (fileerr) {
            if (fileerr) {
                return console.log(`Unable to write file ::> ${fileerr}`);
            }
        });
    },
    downloadFile: function(res, stream, name='file') {
        let file = Buffer.from(stream, 'utf8');
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-disposition': `attachment; filename=${name}.html`,
            'Content-Length': file.length
        });
        res.end(file);
    }
}
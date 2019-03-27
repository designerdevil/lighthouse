const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const fs = require('fs');
const { website, urls } = require('../../config/urlConfig');

module.exports = {
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
    },
    makeNewDir: function() {
        var dir = `./public/report-on-${Date.now()}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            return dir;
        }
        return './public';
    }
}
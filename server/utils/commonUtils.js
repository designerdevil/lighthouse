const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const fs = require('fs');
const URL = require('url').URL;
const { website, urls } = require('../../config/urlConfig');

module.exports = {
    generateList: function(replacer, template, values) {
        const url = new URL(website)
        const renderTemplate = template.replace('my-title', url.hostname)
        return renderTemplate.replace(replacer, values.map((value, index) => {
            return `<tr>
                <td>${value}</td>
                <td><a href=/webReport?type=view&url=${value}>Generate Report</a>
                <a href=/webReport?type=download&url=${value}>Download Report</a></td>
                </tr>
            `
        }).join(''));
    },
    generateFolderList: function(replacer, template, values) {
        const url = new URL(urls[0].url)
        const renderTemplate = template.replace('my-title', url.hostname)
        return renderTemplate.replace(replacer, values.map((value, index) => {
            const dirName = value.dirName;
            const dateStamp = dirName.split('-')[2]
            const date = new Date(parseInt(dateStamp));
            const fileNames = value.fileNames
            const fileLength = fileNames.length;
            return `<tr class="${!fileLength ? 'error' : 'success'}">
                <td>${date}</td>
                <td title="${fileNames.join(",\n")}">${fileLength}</td>
                <td>
                    ${fileLength ? `
                        <a href=/archive?report=${dirName}>Download Zip</a>
                        <a href=/archive?type=delete&report=${dirName}>Delete</a>` : `
                        <a href=/archive?type=delete&report=${dirName}>Delete</a>
                    `}
                </td>
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
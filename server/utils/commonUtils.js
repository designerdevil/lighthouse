const chromeLauncher = require("chrome-launcher");
const lighthouse = require("lighthouse");
const fs = require("fs");

const commonUtil = {
    launchChromeAndRunLighthouse: function (url, opts, callback, config = null) {
        return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
            opts.port = chrome.port;
            return lighthouse(url, opts, config).then(results => {
                report = results.report;
                callback(report);
                return chrome.kill().then(() => results.lhr)
            });
        });
    },
    writeFile: function (path, content) {
        fs.writeFile(path, content, function (fileerr) {
            if (fileerr) {
                return console.log(`Unable to write file ::> ${fileerr}`);
            }
        });
    },
    downloadFile: function (res, stream, name = "file") {
        let file = Buffer.from(stream, "utf8");
        res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-disposition": `attachment; filename=${name}.html`,
            "Content-Length": file.length
        });
        res.end(file);
    },
    makeNewDir: function () {
        const dateStamp = Date.now()
        console.log(commonUtil.getMomentDate(dateStamp))
        var folderName = `report-on-${commonUtil.getMomentDate(dateStamp)}`
        const date = new Date(parseInt(dateStamp));
        var dir = `./public/${folderName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            return {
                dirName: dir,
                folderName: folderName,
                date
            };
        }
        return "./public";
    },
    getMomentDate: function (dateStamp) {
        const dirName = new Date(dateStamp).toISOString();
        return dirName.replace(/:/g, '|');
    },
    getLocalDate: function (dirName) {
        const dateStamp = dirName.split("report-on-")[1]
        const stampParser = new Date(`${dateStamp.replace(/\|/g, ':')}`).toLocaleString()
        return stampParser;
    },
    getUTCDate: function (dirName) {
        const utcStamp = dirName.split("report-on-")[1]
        return utcStamp.replace(/\|/g, ':');
    },
    sanitizeDirName: function (dirName) {
        const newDname = dirName.replace(/\|/g, '-').replace(/\./g, '-').toLowerCase();
        console.log(newDname)
        return newDname
    }
}

module.exports = commonUtil;
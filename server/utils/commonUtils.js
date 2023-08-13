const chromeLauncher = require("chrome-launcher");
const lighthouse = require("lighthouse");
const fs = require("fs");
const rimraf = require("rimraf");
var zlib = require("zlib");

const commonUtil = {
    launchChromeAndRunLighthouse: async function (url, opts, callback) {
        const chrome = await chromeLauncher.launch({chromeFlags: ['--headless', '--disable-gpu']});
        const options = {port: chrome.port, ...opts};
        const runnerResult = await lighthouse(url, options);
        const report = await runnerResult.report;
        callback(report);
        await chrome.kill();
    },
    writeFile: function (path, content, shouldGzip) {
        fs.writeFile(path, content, function (fileerr) {
            if (fileerr) {
                return console.log(`Unable to write file ::> ${fileerr}`);
            }
            if (shouldGzip) {
                var gzip = zlib.createGzip();
                var readStream = fs.createReadStream(path);
                var writeStream = fs.createWriteStream(`${path}.js`);
                readStream.pipe(gzip).pipe(writeStream);
                rimraf(path, function () {
                    fs.rename(`${path}.js`, path, function (err) {
                        if (err) throw err;
                        console.log('File Renamed.');
                    });
                });
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
        return dirName.replace(/:/g, '_');
    },
    getLocalDate: function (dirName) {
        const dateStamp = dirName.split("report-on-")[1]
        const stampParser = new Date(`${dateStamp.replace(/\_/g, ':')}`).toLocaleString()
        return stampParser;
    },
    getUTCDate: function (dirName) {
        const utcStamp = dirName.split("report-on-")[1]
        return utcStamp.replace(/\_/g, ':');
    },
    sanitizeDirName: function (dirName) {
        const newDname = dirName.replace(/\_/g, '-').replace(/\./g, '-').toLowerCase();
        console.log(newDname)
        return newDname
    }
}

module.exports = commonUtil;
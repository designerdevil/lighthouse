const URL = require("url").URL;
const opts = require("../../config/runtimeConfig");
const { website } = require("../../config/urlConfig");
const { launchChromeAndRunLighthouse, downloadFile } = require("../utils/commonUtils")

module.exports = (req, res, next) => {
    const url = new URL(website)
    const generatedURL = `${url.protocol}//${url.hostname}${url.port && ":" + url.port}${req.query.url}${url.search}`;
    const type = req.query.type;
    console.log(generatedURL);
    launchChromeAndRunLighthouse(generatedURL, opts, (report) => {
        const result = Array.isArray(report) ? report[0] : report;
        return (type == "download") ? downloadFile(res, result, `report-${Date.now()}`) : res.send(result);

    }).then(results => {
        console.log("Report Served")
    });
}
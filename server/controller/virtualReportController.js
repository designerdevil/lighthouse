const URL = require('url').URL;
const path = require('path');
const opts = require('../../config/runtimeConfig');
const { website } = require('../../config/urlConfig');
const { launchChromeAndRunLighthouse, downloadFile } = require('../utils/commonUtils')

module.exports = (req, res, next) => {
    const url = new URL(website)
    const generatedURL = `${url.protocol}//${url.hostname}${url.port && ':' + url.port}${req.query.url}${url.search}`;
    const type = req.query.type;
    console.log(generatedURL);
    launchChromeAndRunLighthouse(generatedURL, opts, (report) => {
        return (type == 'download') ? downloadFile(res, report, `report-${Date.now()}`) : res.send(report);
        
    }).then(results => {
        console.log('Report Served')
        // res.sendFile(path.join(__dirname, '../../public/report.html'))
    });
}
var URL = require('url').URL;
var path = require('path');
var opts = require('../config/runtimeConfig');
var { launchChromeAndRunLighthouse, downloadFile } = require('../utils/commonUtils')

module.exports = (req, res, next) => {
    const website = process.env.WEBSITE;
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
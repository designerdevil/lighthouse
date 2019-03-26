var virtualReportController = require('../controller/virtualReportController');
var physicalReportController = require('../controller/physicalReportController');
var request = require('request');
var getHrefs = require('get-hrefs');
var template = require('../utils/template')
var {generateChecklist} = require('../utils/commonUtils')


module.exports = function (app) {
    let websiteURLs;
    const website = process.env.WEBSITE || '';
    if (website != '') {
        request(website, function (error, response, body) {
            websiteURLs = getHrefs(body)
            .map((value, index) => {
                if(value.indexOf(website) != -1)
                    return value.replace(website, '')
                else 
                    return value
            })
            .filter((value) => value.charAt(0) == '/')
            app.get('/', (req, res, next) => {
                res.send(generateChecklist(template, websiteURLs))
            })
            app.get('*' , virtualReportController)
        });
    } else {
        app.get('/', physicalReportController)
    }
};





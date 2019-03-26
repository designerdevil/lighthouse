const virtualReportController = require('../controller/virtualReportController');
const physicalReportController = require('../controller/physicalReportController');
const reportListController = require('../controller/reportListController');
const archiveController = require('../controller/archiveController');
const request = require('request');
const getHrefs = require('get-hrefs');
const template = require('../utils/template')
const {generateList} = require('../utils/commonUtils')


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
                res.send(generateList('href-list', template, websiteURLs))
            })
            app.get('/webReport' , virtualReportController)
            app.get('*' , (req,res,next) => {
                res.redirect('/')
            })
        });
    } else {
        app.get('/', physicalReportController)
        app.get('/list', reportListController)
        app.get('/archive', archiveController)
    }
};





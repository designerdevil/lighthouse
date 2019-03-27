const virtualReportController = require('../controller/virtualReportController');
const physicalReportController = require('../controller/physicalReportController');
const reportListController = require('../controller/reportListController');
const archiveController = require('../controller/archiveController');
const request = require('request');
const getHrefs = require('get-hrefs');
const template = require('../utils/template');
const { website } = require('../../config/urlConfig');
const {generateList} = require('../utils/commonUtils')


module.exports = function (app) {
    let websiteURLs;
    if (website) {
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
                res.render('layouts/main', {
                    type: true,
                    website: website,
                    websiteURLs
                });
                // res.send(generateList('href-list', template, websiteURLs))
            })
            app.get('/webReport' , virtualReportController)
            app.get('*' , (req,res,next) => {
                res.redirect('/')
            })
        });
    } else {
        app.get('/', reportListController)
        app.get('/generateWebReport', physicalReportController)
        app.get('/archive', archiveController)
        app.get('*' , (req,res,next) => {
            res.redirect('/')
        })
    }
};





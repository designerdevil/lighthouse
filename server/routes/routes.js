var getUrlController = require('../controller/getUrlController');
var request = require('request');
var getHrefs = require('get-hrefs');
var template = require('../utils/template')


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
                res.send(
                    template.replace('href-list', websiteURLs.map((value, index) => {
                        return `<tr>
                            <td>${value}</td>
                            <td><a href=${value}>Generate Report</a></td>
                            </tr>
                        `
                    }).join(''))
                )
            })
            app.get('*' , getUrlController)

        });
    } else {
        app.get('/', (req, res, next) => {
            res.send('Website Param Not Configured Properly')
        })
    }
};





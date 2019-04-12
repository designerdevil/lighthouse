const virtualReportController = require("../controller/virtualReportController");
const physicalReportController = require("../controller/physicalReportController");
const reportListController = require("../controller/reportListController");
const hookController = require("../controller/hookController");
const archiveController = require("../controller/archiveController");
const azureController = require("../controller/azureController");
const gcpController = require("../controller/gcpController");
const request = require("request");
const getHrefs = require("get-hrefs");
const { website } = require("../../config/urlConfig");
const route = require("../constants/endpoints");


module.exports = function (app) {
    let websiteURLs;
    if (website) {
        request(website, function (error, response, body = "") {
            websiteURLs = getHrefs(body)
                .map((value, index) => {
                    if (value.indexOf(website) != -1)
                        return value.replace(website, "")
                    else
                        return value
                })
                .filter((value) => value.charAt(0) == "/")
            app.get(route.root, (req, res, next) => {
                res.render("layouts/main", {
                    type: true,
                    website: website,
                    hasURL: !!websiteURLs.length,
                    websiteURLs
                });
            })
            app.get(route.webReport, virtualReportController)
            app.get("*", (req, res, next) => {
                res.redirect(route.root)
            })
        });
    } else {
        app.get(route.root, reportListController)
        app.get(route.physicalReport, physicalReportController)
        app.get(route.archive, archiveController)
        app.get(route.azure, azureController)
        app.get(route.gcp, gcpController)
        app.post(route.hook, hookController)
        app.get("*", (req, res, next) => {
            res.redirect(route.root)
        })
    }
};





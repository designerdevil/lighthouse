const virtualReportController = require("../controller/virtualReportController");
const physicalReportController = require("../controller/physicalReportController");
const reportListController = require("../controller/reportListController");
const hookController = require("../controller/hookController");
const archiveController = require("../controller/archiveController");
const azureController = require("../controller/azureController");
const request = require("request");
const getHrefs = require("get-hrefs");
const { website } = require("../../config/urlConfig");


module.exports = function (app) {
    let websiteURLs;
    if (website) {
        request(website, function (error, response, body) {
            websiteURLs = getHrefs(body)
                .map((value, index) => {
                    if (value.indexOf(website) != -1)
                        return value.replace(website, "")
                    else
                        return value
                })
                .filter((value) => value.charAt(0) == "/")
            app.get("/", (req, res, next) => {
                res.render("layouts/main", {
                    type: true,
                    website: website,
                    websiteURLs
                });
            })
            app.get("/webReport", virtualReportController)
            app.get("*", (req, res, next) => {
                res.redirect("/")
            })
        });
    } else {
        app.get("/", reportListController)
        app.get("/generateWebReport", physicalReportController)
        app.get("/archive", archiveController)
        app.get("/pushToAzure", azureController)
        app.post("/hookme", hookController)
        app.get("*", (req, res, next) => {
            res.redirect("/")
        })
    }
};





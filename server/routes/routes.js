import virtualReportController from "../controller/virtualReportController.js";
import physicalReportController from "../controller/physicalReportController.js";
import reportListController from "../controller/reportListController.js";
import hookController from "../controller/hookController.js";
import hookViewController from "../controller/hookViewController.js";
import archiveController from "../controller/archiveController.js";
import azureController from "../controller/azureController.js";
import gcpController from "../controller/gcpController.js";
import viewUIFormController from "../controller/viewUIFormController.js";
import viewUIController from "../controller/viewUIController.js";
import request from "request"
import * as myurl from "url";
import { load } from "cheerio";
import urlConfig from "../../config/urlConfig.js"
import route from "../constants/endpoints.js"

export default function (app) {
    const { website } = urlConfig;
    let websiteURLs;
    if (website) {
        request(website, function (error, response, body = "") {
			const url = new myurl.URL(website)
            const $ = load(body)
            const links = $('a')
            const hrefValues = []
			$(links).each(function(i, link){
                hrefValues.push($(link).attr('href'))
            });
			websiteURLs = [...new Set(hrefValues)].map((value, index) => {
				if (value.indexOf(website) != -1)
					return value.replace(website, "")
				else
					return value
			})
			.filter((value) => value.charAt(0) == "/")
            app.get(route.root, (req, res, next) => {
                res.render("layouts/main", {
                    type: true,
                    website: url.origin,
					pathname: url.pathname,
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
        app.get(route.view, hookViewController)
        app.get(route.viewUIForm, viewUIFormController)
        app.post(route.viewUI, viewUIController)
        app.post(route.hook, hookController)
        // app.get("*", (req, res, next) => {
        //     res.redirect(route.root)
        // })
    }
};





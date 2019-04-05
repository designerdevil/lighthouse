const configData = require("../../config/urlConfig");
const route = require("../constants/endpoints");
const { events, types } = require("../constants/appConstants");

module.exports = (req, res, next) => {
    console.log(":::> Incoming Request")
    const reqHeader = req.headers;
    const brand = reqHeader['x-brand'] || '';
    const type = reqHeader['x-type'] || types.azure;
    const event = reqHeader['x-event'] || events.deployment;
    const connectionString = reqHeader['x-connection-string'] || false;
    configData.external = req.body ? [...req.body] : []

    if(configData.hookInProgress) {
        res.json({
            status: "error",
            message: "Another hook is in progress. Please try after sometime"
        })
    }
    configData.hookInProgress = true;
    if (connectionString && event == events.deployment) {
        process.env.AZURE_STORAGE_CONNECTION_STRING = connectionString;
        res.redirect(`${route.physicalReport}?hook=true&brand=${brand}&event=${event}`)
        return;
    } else if (connectionString && event == events.view) {
        if(type == types.azure) {
            process.env.AZURE_STORAGE_CONNECTION_STRING = connectionString;
            res.redirect(`${route.azure}?hook=true&brand=${brand}&event=${event}`)
            return;
        }
        if(type == types.gcp) {
            process.env.GOOGLE_APPLICATION_CREDENTIALS = connectionString;
            res.redirect(`${route.azure}?hook=true&brand=${brand}&event=${event}`)
            return;
        }
    } else if (event == events.generate) {
        res.redirect(`${route.physicalReport}?hook=false&event=${event}`)
        return;
    } else {
        configData.hookInProgress = false;
        res.json({
            status: "failure",
            error: (!connectionString) ? "Please provide AZURE connection string" : "Provide correct deployment hook header"
        });
        return;
    }
}
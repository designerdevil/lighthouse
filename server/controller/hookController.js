import configData from "../../config/urlConfig.js";
import route from "../constants/endpoints.js";
import constant from "../constants/appConstants.js";

export default (req, res, next) => {
    const { events, types } = constant;
    console.log(":::> Incoming Request")
    const reqHeader = req.headers;
    const brand = reqHeader['x-brand'] || '';
    const type = reqHeader['x-type'] || types.azure;
    const event = reqHeader['x-event'] || events.deployment;
    const connectionString = reqHeader['x-connection-string'] || false;
    configData.external = req.body ? [...req.body] : []

    if (configData.hookInProgress) {
        res.json({
            status: "error",
            message: "Another hook is in progress. Please try after sometime"
        });
        return;
    }
    configData.hookInProgress = true;
    if (event == events.generate) {
        res.redirect(`${route.physicalReport}?hook=false&event=${event}`)
        return;
    }
    if (type == types.azure) {
        if (connectionString && event == events.deployment) {
            process.env.AZURE_STORAGE_CONNECTION_STRING = connectionString;
            res.redirect(`${route.physicalReport}?hook=true&brand=${brand}&event=${event}&type=${type}`)
            return;
        } else {
            configData.hookInProgress = false;
            res.json({
                status: "failure",
                error: (!connectionString) ? "Please provide AZURE connection string" : "Provide correct deployment hook header"
            });
            return;
        }
    } else if (type == types.gcp) {
        if (connectionString && event == events.deployment) {
            process.env.GCP_PROJECT_STRING = connectionString;
            res.redirect(`${route.physicalReport}?hook=true&brand=${brand}&event=${event}&type=${type}&project=${connectionString}`)
            return;
        } else {
            res.json({
                status: "failure",
                error: (!connectionString) ? "Please provide Project ID for GCS" : "Provide correct deployment hook header"
            });
            return;
        }
    }
}
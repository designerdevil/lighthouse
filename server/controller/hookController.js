const configData = require("../../config/urlConfig");
const route = require("../constants/endpoints");

module.exports = (req, res, next) => {
    console.log(":::> Incoming Request")
    const reqHeader = req.headers;
    if (reqHeader['x-connection-string'] && reqHeader['x-event'] == 'deployment') {
        const brand = reqHeader['x-brand'] || '' ;
        const type = reqHeader['x-type'] || 'azure';
        process.env.AZURE_STORAGE_CONNECTION_STRING = req.headers['x-connection-string'];
        configData.external = req.body ? [...req.body] : []
        res.redirect(`${route.physicalReport}?hook=true&brand=${brand}&type=${type}`)
    } else {
        res.json({
            status: "failure",
            error: (!reqHeader["x-connection-string"]) ? "Please provide AZURE connection string" : "Provide correct deployment hook header"
        });
        return;
    }
}
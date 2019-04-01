const configData = require('../../config/urlConfig');

module.exports = (req, res, next) => {
    console.log("Incoming Request")
    const reqHeader = req.headers;
    if (reqHeader['x-connection-string'] && reqHeader['x-event'] == 'deployment') {
        process.env.AZURE_STORAGE_CONNECTION_STRING = req.headers['x-connection-string'];
        configData.external = req.body ? [...req.body] : []
        res.redirect("/generateWebReport?hook=true")
    } else {
        res.json({
            status: 'failure',
            error: (!reqHeader['x-connection-string']) ? 'Please provide AZURE connection string' : 'Provide correct deployment hook header'
        });
        return;
    }
}
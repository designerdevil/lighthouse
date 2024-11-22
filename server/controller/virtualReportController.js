import * as myurl from "url";
import opts from "../../config/lighthouseFlags.js";
import config from "../../config/urlConfig.js";
import { launchChromeAndRunLighthouse, downloadFile } from "../utils/commonUtils.js"

export default (req, res, next) => {
    const { website } = config;
    const url = new myurl.URL(website)
    const generatedURL = `${url.protocol}//${url.hostname}${url.port && ":" + url.port}${req.query.url}${url.search}`;
    const type = req.query.type;
    console.log(generatedURL);
    launchChromeAndRunLighthouse(generatedURL, opts, (report) => {
        const result = Array.isArray(report) ? report[0] : report;
        return (type == "download") ? downloadFile(res, result, `report-${Date.now()}`) : res.send(result);

    }).then(results => {
        console.log("Report Served")
    });
}
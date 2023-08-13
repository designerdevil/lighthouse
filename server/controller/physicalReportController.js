const defer = require("promise-defer");
const opts = require("../../config/runtimeConfig");
const configData = require("../../config/urlConfig");
const { launchChromeAndRunLighthouse, writeFile, makeNewDir } = require("../utils/commonUtils");
const route = require("../constants/endpoints");
const { types, events } = require("../constants/appConstants");

module.exports = (req, res, next) => {
    const { hook, type, brand, event } = req.query;
    function urlIterator(condition, action) {
        const resolver = defer();
        function loop() {
            if (!condition()) return resolver.resolve();
            return Promise.resolve(action()).then(loop).catch(resolver.reject);
        }
        process.nextTick(loop);
        return resolver.promise;
    }

    function generateReports(urls, opts) {
        const { dirName, folderName } = makeNewDir()
        return new Promise((resolve, reject) => {
            let urlArrayPosition = 0;
            urlIterator(
                () => urlArrayPosition < urls.length,
                () => {
                    const urlObj = urls[urlArrayPosition];
                    const url = urlObj.url;
                    const name = urlObj.name && urlObj.name.toLowerCase().replace(/ /g, "-");
                    const shouldGzip = (type == types.azure);
                    return launchChromeAndRunLighthouse(url, opts, (report) => {
                        for (let i = 0, length = opts.output.length; i < length; i++) {
                            writeFile(`${dirName}/${name}.${opts.output[i]}`, report[i], shouldGzip);
                        }
                    }).then(results => {
                        console.log(`Report Saved for ${name}`)
                        urlArrayPosition++;
                    })
                }
            )
                .then(() => {
                    resolve();
                    if (event == events.generate) {
                        configData.hookInProgress = false;
                        res.json({
                            status: "success",
                            reportName: dirName,
                            message: `Directory generated in public repository ::> ${dirName}`
                        })
                        return;
                    }
                    if (hook && event == events.deployment) {
                        if (type == types.azure) {
                            res.redirect(`${route.azure}?hook=true&report=${folderName}&brand=${brand}&event=${event}`)
                        } else if (type == types.gcp) {
                            res.redirect(`${route.gcp}?hook=true&report=${folderName}&brand=${brand}&event=${event}`)
                        }
                    } else {
                        configData.hookInProgress = false;
                        res.redirect(route.root)
                    }
                })
                .catch(error => {
                    console.log("error", error);
                    reject(error);
                });
        });
    }
    const urls = configData.external.length ? configData.external : configData.urls
    return generateReports(urls, opts)


}
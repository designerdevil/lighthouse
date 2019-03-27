const path = require('path');
const defer = require('promise-defer');
const opts = require('../../config/runtimeConfig');
const { urls } = require('../../config/urlConfig');
const { launchChromeAndRunLighthouse, writeFile, makeNewDir } = require('../utils/commonUtils')

module.exports = (req, res, next) => {
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
        const dirName = makeNewDir()
        return new Promise((resolve, reject) => {
            let urlArrayPosition = 0;
            urlIterator(
                () => urlArrayPosition < urls.length,
                () => {
                    const urlObj = urls[urlArrayPosition];
                    const url = urlObj.url;
                    const name = urlObj.name && urlObj.name.toLowerCase().replace(/ /g,'-');
                    return launchChromeAndRunLighthouse(url, opts, (report) => {
                        writeFile(`${dirName}/${name}.html`, report)
                    }).then(results => {
                        console.log(`Report Saved for ${name}`)
                        urlArrayPosition++;
                    })
                }
            )
                .then(() => {
                    resolve();
                    res.redirect('/')
                })
                .catch(error => {
                    this.emit('error', error);
                    reject(error);
                });
        });
    }

    return generateReports(urls, opts)


}
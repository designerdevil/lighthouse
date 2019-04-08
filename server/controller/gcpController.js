const fs = require("fs");
const rimraf = require("rimraf");
const configData = require("../../config/urlConfig");
const { getUTCDate, sanitizeDirName } = require("../utils/commonUtils");
const route = require("../constants/endpoints");
const { events } = require("../constants/appConstants");
const { Storage } = require('@google-cloud/storage');

module.exports = (req, res, next) => {
    const event = req.query.event;
    const path = require("path");
    const dirName = req.query.report;

    const storage = new Storage({
        projectId: 'audit-report-236705',
        keyFilename: './key/audit-report-ae233ce12244.json'
    })

    const uploadLocalFile = async (bucketName, filePath) => {
        var myBucket = storage.bucket(bucketName)
        myBucket.upload(filePath, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
        })
    };

    if (event == events.deployment) {
        const dirObj = {
            status: "success",
            reportName: `${req.query.brand}-${sanitizeDirName(dirName)}`,
            isoDate: getUTCDate(dirName)
        }

        // The name for the new bucket
        const bucketName = dirObj.reportName;

        storage.createBucket(bucketName).then(() => {
            const rootPath = "./public"
            console.log(`Bucket ${bucketName} created.`);

            const dirName = req.query.report;
            let fileLen = fs.readdirSync(`${rootPath}/${dirName}`).length;
            fs.readdirSync(`${rootPath}/${dirName}`).forEach(async (file) => {
                uploadLocalFile(dirObj.reportName, `${rootPath}/${dirName}/${file}`);
                fileLen--
                if (fileLen <= 0) {
                    configData.hookInProgress = false;
                    rimraf(`${rootPath}/${dirName}`, function () {
                        const archiveFile = `${rootPath}/${dirName}.zip`;
                        if (fs.existsSync(archiveFile)) {
                            rimraf(archiveFile, function () {
                                console.log(`Archive Deleted ${dirName}.zip`);
                                if (req.query.hook) {
                                    res.json(dirObj)
                                    configData.external = []
                                } else
                                    res.redirect(route.root);
                            });
                        } else {
                            if (req.query.hook) {
                                res.json(dirObj)
                                configData.external = []
                            } else
                                res.redirect(route.root);
                        }
                    });
                }
            });
        }).catch(err => {
            console.error('ERROR:', err);
            res.send(err);
        });
    }

}
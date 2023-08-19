import fs from "fs"
import path from "path"
import { rimrafSync } from "rimraf"
import configData from "../../config/urlConfig.js"
import { getUTCDate, sanitizeDirName } from "../utils/commonUtils.js"
import route from "../constants/endpoints.js"
import constant from "../constants/appConstants.js"
import { Storage } from "@google-cloud/storage"

export default (req, res, next) => {
    const { events } = constant;
    if (!process.env.GCP_PROJECT_STRING) {
        configData.hookInProgress = false;
        res.json({
            status: "fail",
            error: "Please provide GCP Project name in Connection string header"
        });
        return;
    }
    const event = req.query.event;
    const dirName = req.query.report;

    const storage = new Storage({
        projectId: process.env.GCP_PROJECT_STRING,
        keyFilename: './key/key.json'
    })

    const uploadLocalFile = async (bucketName, filePath) => {
        const bucket = storage.bucket(bucketName)
        const fileName = path.basename(filePath);
        const file = bucket.file(fileName);
        bucket.upload(filePath, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            }
        }).then(() => {
            file.makePublic()
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

        storage.createBucket(bucketName, {
            cors: [
                {
                    origin: ["http://localhost:4002"],
                    method: ["GET"],
                    responseHeader: ["Content-Type"],
                    maxAgeSeconds: 3600
                }
            ]
        }).then(() => {
            const rootPath = "./public"
            console.log(`Bucket ${bucketName} created.`);

            const dirName = req.query.report;
            let fileLen = fs.readdirSync(`${rootPath}/${dirName}`).length;
            fs.readdirSync(`${rootPath}/${dirName}`).forEach(async (file) => {
                uploadLocalFile(dirObj.reportName, `${rootPath}/${dirName}/${file}`);
                fileLen--
                if (fileLen <= 0) {
                    configData.hookInProgress = false;
                    rimrafSync(`${rootPath}/${dirName}`);
                    const archiveFile = `${rootPath}/${dirName}.zip`;
                    if (fs.existsSync(archiveFile)) {
                        rimrafSync(archiveFile);
                        console.log(`Archive Deleted ${dirName}.zip`);
                        if (req.query.hook) {
                            res.json(dirObj)
                            delete process.env.GCP_PROJECT_STRING
                            configData.external = []
                        } else
                            res.redirect(route.root);
                    } else {
                        if (req.query.hook) {
                            res.json(dirObj)
                            delete process.env.GCP_PROJECT_STRING
                            configData.external = []
                        } else
                            res.redirect(route.root);
                    }
                }
            });
        }).catch(err => {
            console.error('::::ERROR IN GCP CONTROLLER::::', err);
            delete process.env.GCP_PROJECT_STRING
            res.send('-> ERROR OCCURRED')
        });
    }

}
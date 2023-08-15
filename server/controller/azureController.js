import fs from "fs"
import { rimrafSync } from "rimraf"
import configData from "../../config/urlConfig.js"
import { getUTCDate, sanitizeDirName } from "../utils/commonUtils.js"
import route from "../constants/endpoints.js"
import constant from "../constants/appConstants.js"

export default (req, res, next) => {
    const { events } = constant;
    const event = req.query.event;
    const path = require("path");
    const storage = require("azure-storage");

    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
        configData.hookInProgress = false;
        res.json({
            status: "fail",
            error: "Please provide AZURE connection string"
        });
        return;
    }

    const blobService = storage.createBlobService();

    const listContainers = async () => {
        return new Promise((resolve, reject) => {
            blobService.listContainersSegmented(null, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `${data.entries.length} containers`, containers: data.entries });
                }
            });
        });
    };

    const createContainer = async (containerName) => {
        return new Promise((resolve, reject) => {
            blobService.createContainerIfNotExists(containerName, { publicAccessLevel: "blob" }, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Container "${containerName}" created` });
                }
            });
        });
    };

    const uploadLocalFile = async (containerName, filePath) => {
        return new Promise((resolve, reject) => {
            const fullPath = path.resolve(filePath);
            const blobName = path.basename(filePath);
            const options = {
                contentSettings: {
                    contentEncoding: 'gzip'
                }
            }
            blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, options, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Local file "${blobName}" is uploaded` });
                }
            });
        });
    };


    if (event == events.deployment) {
        const dirName = req.query.report;
        const dirObj = {
            status: "success",
            reportName: `${req.query.brand}-${sanitizeDirName(dirName)}`,
            isoDate: getUTCDate(dirName)
        }

        const execute = async () => {
            const path = "./public"
            let response;

            console.log("Containers Found ::");
            response = await listContainers();
            response.containers.forEach((container) => console.log(` -  ${container.name}`));
            const containerList = response.containers;
            const containerDoesNotExist = containerList.findIndex((container) => container.name === dirObj.reportName) === -1;

            if (containerDoesNotExist) {
                await createContainer(dirObj.reportName);
                console.log(`Container "${dirObj.reportName}" is created`);
            }
            let fileLen = fs.readdirSync(`${path}/${dirName}`).length;
            fs.readdirSync(`${path}/${dirName}`).forEach(async (file) => {
                response = await uploadLocalFile(dirObj.reportName, `${path}/${dirName}/${file}`);
                console.log(response.message);
                fileLen--
                if (fileLen <= 0) {
                    configData.hookInProgress = false;
                    rimrafSync(`${path}/${dirName}`);
                    const archiveFile = `${path}/${dirName}.zip`;
                    if (fs.existsSync(archiveFile)) {
                        rimrafSync(archiveFile);
                        console.log(`Archive Deleted ${dirName}.zip`);
                        if (req.query.hook) {
                            res.json(dirObj)
                            delete process.env.AZURE_STORAGE_CONNECTION_STRING
                            configData.external = []
                        } else
                            res.redirect(route.root);
                    } else {
                        if (req.query.hook) {
                            res.json(dirObj)
                            delete process.env.AZURE_STORAGE_CONNECTION_STRING
                            configData.external = []
                        } else
                            res.redirect(route.root);
                    }
                }
            });

        }

        execute().then(() => {
            console.log(`"${dirObj.reportName}" :::: Pushing to Azure...`)
        }).catch((e) => {
            res.send(e)
        });
    } else {
        const execute = async () => {
            let response;
            response = await listContainers();
            const containerList = response.containers;
            res.json(containerList)
        }
        execute().then(() => {
            //do something
        }).catch((e) => {
            res.send(e)
        });
    }
}
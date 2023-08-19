
import constant from "../constants/appConstants.js";

export default (req, res, next) => {
    const { baseURL, types } = constant;
    console.log("::::> HOOK VIEW CONTROLLER");
    const reqHeader = req.headers;

    const brand = reqHeader['x-brand'] || '';
    const type = reqHeader['x-type'] || types.azure;
    const connectionString = reqHeader['x-connection-string'] || false;

    if (type == types.azure) {
        process.env.AZURE_STORAGE_CONNECTION_STRING = connectionString;
        const storage = require("azure-storage");
        const blobService = storage.createBlobService();
        const listContainers = async () => {
            return new Promise((resolve, reject) => {
                blobService.listContainersSegmented(null, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        const filteredBrand = data.entries.filter((item) => item.name.indexOf(brand) != -1)
                        resolve({ message: `${data.entries.length} containers`, containers: filteredBrand });
                    }
                });
            });
        };
        const listFiles = (containerName) => {
            return new Promise((resolve, reject) => {
                blobService.listBlobsSegmented(containerName, null, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            containerName,
                            files: data.entries.filter((item) => item.name.indexOf(".html") == -1).map((value, item) => ({
                                name: value.name,
                                time: value.creationTime,
                                url: `${baseURL.azure}${containerName}/${value.name}`,
                                reporturl: `${baseURL.azure}${containerName}/${value.name.replace('.json', '.html')}`
                            }))
                        });
                    }
                });
            });
        }
        const execute = async () => {
            let response;
            response = await listContainers();
            const containerList = response.containers.map((item, index) => ({
                name: item.name
            }));
            let result = Promise.all(containerList.map((item, index) => listFiles(item.name))).then((containers) => {
                const data = {
                    brand,
                    containers: containers
                }
                res.render("layouts/timeline", {
                    type,
                    form: false,
                    brand,
                    data: JSON.stringify(data)
                });
                delete process.env.AZURE_STORAGE_CONNECTION_STRING;
            })
        }
        return execute().then(() => {
            console.log(":::PULLING FILES FROM AZURE:::")
        }).catch((e) => {
            console.log(":::ERROR in PULLING FILES FROM AZURE:::", e)
            res.send('-> ERROR OCCURRED')
        });
    } else if (type == types.gcp) {
        process.env.GCP_PROJECT_STRING = connectionString;
        const { Storage } = require('@google-cloud/storage');
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_STRING,
            keyFilename: './key/key.json'
        });
        const listFiles = async (bucketName) => {
            const [files] = await storage.bucket(bucketName).getFiles();
            return new Promise((resolve, reject) => {
                        resolve({
                            containerName: bucketName,
                            files: files.filter((item) => item.name.indexOf(".html") == -1).map((value, item) => ({
                                name: value.name,
                                time: new Date(value.metadata.timeCreated).toUTCString(),
                                url: `${baseURL.gcp}${bucketName}/${value.name}`,
                                reporturl: `${baseURL.gcp}${bucketName}/${value.name.replace('.json', '.html')}`
                            }))
                        });
            });
        }
        const listBuckets = async () => {
            const [buckets] = await storage.getBuckets();
            const filteredBuckets = buckets.filter((item) => item.name.indexOf(brand) != -1)
            return ({ message: `${filteredBuckets.length} containers`, containers: filteredBuckets });
        }
        const execute = async () => {
            
            let response;
            response = await listBuckets();
            const containerList = response.containers.map((item, index) => ({
                name: item.name
            }));
            let result = Promise.all(containerList.map((item, index) => listFiles(item.name))).then((containers) => {
                const data = {
                    brand,
                    containers: containers
                }
                res.render("layouts/timeline", {
                    type,
                    form: false,
                    brand,
                    data: JSON.stringify(data)
                });
                delete process.env.AZURE_STORAGE_CONNECTION_STRING;
            })
        }

        return execute().then(() => {
            console.log(":::PULLING FILES FROM GCP:::")
        }).catch((e) => {
            
            console.log(":::ERROR in PULLING FILES FROM GCP:::", e)
            res.send('-> ERROR OCCURRED')
        });
        
    }
}
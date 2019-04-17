
const { events, types } = require("../constants/appConstants");

module.exports = (req, res, next) => {
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
                        const filteredBrand = data.entries.filter((item)=> item.name.indexOf(brand)!=-1)
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
                            files: data.entries.filter((item)=> item.name.indexOf(".html")==-1).map((value, item) => ({
                                name: value.name,
                                time: value.creationTime,
                                url: `https://storagetestgm.blob.core.windows.net/${containerName}/${value.name}`
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
                name: item.name,
                time: item.lastModified,
                result: []
            }));
            let result = Promise.all(containerList.map((item, index) => listFiles(item.name))).then((containers) => {
                res.json({
                    brand,
                    containers
                })
            })
        }
        execute().then(() => {
            //do something
        }).catch((e) => {
            res.send(e)
        });
    } else if (type == types.gcp) {

    }
}
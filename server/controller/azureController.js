const fs = require('fs');
const rimraf = require("rimraf");

module.exports = (req, res, next) => {

    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config()
    }
    const dirName = req.query.report;
    const path = require('path');
    const storage = require('azure-storage');


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
            blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Container '${containerName}' created` });
                }
            });
        });
    };

    const uploadLocalFile = async (containerName, filePath) => {
        return new Promise((resolve, reject) => {
            const fullPath = path.resolve(filePath);
            const blobName = path.basename(filePath);
            blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Local file "${filePath}" is uploaded` });
                }
            });
        });
    };

    const execute = async () => {
        const path = './public'
        let response;

        console.log("Containers:");
        response = await listContainers();
        response.containers.forEach((container) => console.log(` -  ${container.name}`));

        const containerList = response.containers;
        const containerDoesNotExist = containerList.findIndex((container) => container.name === dirName) === -1;
        if (containerDoesNotExist) {
            await createContainer(dirName);
            console.log(`Container "${dirName}" is created`);
        }
        let fileLen = fs.readdirSync(`${path}/${dirName}`).length;
        fs.readdirSync(`${path}/${dirName}`).forEach(async (file) => {
            response = await uploadLocalFile(dirName, `${path}/${dirName}/${file}`);
            console.log(response.message);
            fileLen--
            if(fileLen<=0){
                rimraf(`${path}/${dirName}`, function () {
                    const archiveFile = `${path}/${dirName}.zip`;
                    if (fs.existsSync(archiveFile)) {
                        rimraf(archiveFile, function () {
                            console.log(`Archive Deleted ${dirName}.zip`);
                            res.redirect('/');
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            }
        });

    }

    execute().then(() => {
        console.log(`"${dirName}" :::: Pushing to Azure...`)
    }).catch((e) => {
        console.log(e)
    });

}
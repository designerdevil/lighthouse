const fs = require('fs');
const template = require('../utils/folder-list')
const { generateFolderList } = require('../utils/commonUtils')
const { urls } = require('../../config/urlConfig');
const url = new URL(urls[0].url)

module.exports = (req, res, next) => {
    const path = './public'
    const dir = []
    fs.readdirSync(path).forEach(dirName => {
        const fileNames = []
        if(dirName.indexOf('report') != -1){
            fs.readdirSync(`${path}/${dirName}`).forEach(file => {
                fileNames.push(file)
            });

            const dateStamp = dirName.split('-')[2]
            const date = new Date(parseInt(dateStamp));
            dir.push({
                dirDate: date,
                dirName,
                fileNames,
                hasFiles: (fileNames.length > 0)
            })
        }
    });
    // fs.readdir(path, function (err, dirs) {
    //     res.send(generateFolderList('report-list', template, dirs))
    // });
    res.render('layouts/main', {
        type: false,
        website: url.hostname,
        dir
    });
    // res.send(generateFolderList('report-list', template, dir))
    // res.send(dir)
}
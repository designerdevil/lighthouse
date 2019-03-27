const fs = require('fs');
const template = require('../utils/folder-list')
const { generateFolderList } = require('../utils/commonUtils')

module.exports = (req, res, next) => {
    const path = './public'
    const dir = []
    fs.readdirSync(path).forEach(dirName => {
        const fileNames = []
        if(dirName.indexOf('report') != -1){
            fs.readdirSync(`${path}/${dirName}`).forEach(file => {
                fileNames.push(file)
            });
            dir.push({
                dirName,
                fileNames
            })
        }
    });
    // fs.readdir(path, function (err, dirs) {
    //     res.send(generateFolderList('report-list', template, dirs))
    // });
    res.send(generateFolderList('report-list', template, dir))
    // res.send(dir)
}
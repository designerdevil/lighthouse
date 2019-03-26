const fs = require('fs');
const template = require('../utils/folder-list')
const { generateFolderList } = require('../utils/commonUtils')

module.exports = (req, res, next) => {
    const path = './public'
    fs.readdir(path, function (err, dirs) {
        res.send(generateFolderList('report-list', template, dirs))
    });
}
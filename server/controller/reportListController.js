const fs = require('fs');
const paths = require('path');

const { urls } = require('../../config/urlConfig');
const url = new URL(urls[0].url);

module.exports = (req, res, next) => {
    const publicPath = './public'
    const dir = []
    fs.readdirSync(publicPath).forEach(dirName => {
        const fileNames = [];
        const fileExt = paths.extname(dirName);
        if(dirName.indexOf('report') != -1 && fileExt !== '.zip' ){
            fs.readdirSync(`${publicPath}/${dirName}`).forEach(file => {
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
    res.render('layouts/main', {
        type: false,
        website: url.hostname,
        dir
    });
}
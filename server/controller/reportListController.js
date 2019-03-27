const fs = require('fs');
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
    res.render('layouts/main', {
        type: false,
        website: url.hostname,
        dir
    });
}
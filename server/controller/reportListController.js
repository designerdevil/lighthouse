const fs = require("fs");
const paths = require("path");
const { urls } = require("../../config/urlConfig");
const { getLocalDate } = require("../utils/commonUtils");

const url = (urls && urls[0].url) ? "URL List" : "Unknown";

module.exports = (req, res, next) => {
    const publicPath = "./public"
    if (!fs.existsSync(publicPath)){
        fs.mkdirSync(publicPath);
    }
    const dir = []
    fs.readdirSync(publicPath).forEach(dirName => {
        const fileNames = [];
        const fileExt = paths.extname(dirName);
        if (dirName.indexOf("report") != -1 && fileExt !== ".zip") {
            fs.readdirSync(`${publicPath}/${dirName}`).forEach(file => {
                fileNames.push(file)
            });
            const stampParser = getLocalDate(dirName);
            dir.push({
                dirDate: stampParser,
                dirName,
                fileNames,
                hasFiles: (fileNames.length > 0)
            })
        }
    });
    res.render("layouts/main", {
        type: false,
        website: url || false,
        dir
    });
}
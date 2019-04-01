const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
var rimraf = require("rimraf");

module.exports = (req, res, next) => {
    const reportName = req.query.report;
    const zippath = `public/${reportName}.zip`
    const type = req.query.type;

    if (type == "delete") {

        rimraf(`./public/${reportName}`, function () {
            const archiveFile = `./public/${reportName}.zip`;
            if (fs.existsSync(archiveFile)) {
                rimraf(archiveFile, function () {
                    console.log("Archive Deleted");
                    res.redirect("/list");
                });
            } else {
                console.log("File Deleted");
                res.redirect("/list");
            }
        });

    } else {

        const output = fs.createWriteStream(`./${zippath}`);
        const archive = archiver("zip");

        output.on("close", function () {
            console.log(`archive created for ${reportName} :: Total bytes ${archive.pointer()}`);
            res.download(path.join(__dirname, `../../${zippath}`));
        });

        archive.on("error", function (err) {
            throw err;
        });
        archive.pipe(output);
        archive.directory(`./public/${reportName}/`, false);
        archive.finalize();

        archive.on("end", function (err) {
            console.log(path.join(__dirname, `../../${zippath}`));
        });

    }
}
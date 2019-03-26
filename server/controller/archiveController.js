const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
var rimraf = require("rimraf");

module.exports = (req, res, next) => {
    const reportName = req.query.report;
    const zippath = `public/${reportName}/${reportName}.zip`
    const type = req.query.type;

    if (type == 'delete') {

        rimraf(`./public/${reportName}`, function () {
            console.log("File Deleted")
            res.redirect('/list')
        });

    } else {

        const output = fs.createWriteStream(`./${zippath}`);
        const archive = archiver('zip');

        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        archive.on('error', function (err) {
            throw err;
        });

        archive.pipe(output);
        // archive.bulk([
        //     { expand: true, cwd: 'source', src: ['**'], dest: 'source' }
        // ]);
        archive.directory(`./public/${reportName}/`, false);
        archive.finalize();
        res.download(path.join(__dirname, `../../${zippath}`))
    }
}
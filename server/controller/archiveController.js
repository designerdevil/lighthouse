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

        // const output = fs.createWriteStream(`./${zippath}`);
        // const archive = archiver('zip');

        // output.on('close', function () {
        //     console.log(archive.pointer() + ' total bytes');
        //     console.log('archiver has been finalized and the output file descriptor has closed.');
        // });

        // archive.on('error', function (err) {
        //     throw err;
        // });
        // archive.pipe(output);
        // archive.directory(`./public/${reportName}/`, true);
        // archive.finalize();

        // archive.on('end', function (err) {
        //     res.download(path.join(__dirname, `../../${zippath}`))
        // });
        
        // ---------------------------------------------------------------------
        
        // var output = fs.createWriteStream(__dirname + "/" + zipName);

        // var archive = archiver('zip');

        // archive.on('error', function (err) {
        //     throw err;
        // });

        // archive.pipe(output);

        // //Add Files to Zip Archive
        // var count = 0;

        // async.each(fileList, function iterator(item, callback) {
        //     var fileName = item.name + "/" + count + ":" + item.caption.trim() + path.extname(item.asset);
        //     count++;
        //     var bucket = urlPrefix.substring(0, urlPrefix.indexOf("/"));
        //     var fileLocation = urlPrefix.substring(urlPrefix.indexOf("/") + 1) + item.asset;

        //     var params = {
        //         Bucket: bucket,
        //         Key: fileLocation
        //     };
        //     s3.getObject(params, function (err, data) {
        //         if (err) {
        //             console.log(err);
        //             callback(err);
        //         } else {
        //             console.log("zipping ", fileName, "...");
        //             archive.append(data.Body, { name: fileName });
        //             callback();
        //         }
        //     });
        // }
        //     , function (done) {
        //         console.log("here");
        //         output.on("close", function () {
        //             console.log(archive.pointer() + " total bytes");
        //             console.log("archiver has been finalized and the output file descriptor has closed.");
        //         });
        //         archive.finalize();
        //     });

    }
}
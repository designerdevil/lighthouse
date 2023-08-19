import path from "path"
import fs from "fs"
import archiver from "archiver"
import { rimrafSync } from "rimraf"
import * as url from 'url';
import route from "../constants/endpoints.js"

export default (req, res, next) => {
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const reportName = req.query.report;
    const zippath = `public/${reportName}.zip`
    const type = req.query.type;

    if (type == "delete") {

        rimrafSync(`./public/${reportName}`);
        const archiveFile = `./public/${reportName}.zip`;
        if (fs.existsSync(archiveFile)) {
            rimrafSync(archiveFile);
            console.log("Archive Deleted");
            res.redirect(route.root);
        } else {
            console.log("File Deleted");
            res.redirect(route.root);
        }

    } else {
        const output = fs.createWriteStream(url.parse(`./${zippath}`, true).path);
        const archive = archiver("zip");

        output.on("close", () => {
            console.log(`archive created for ${reportName} :: Total bytes ${archive.pointer()}`);
            res.download(path.join(__dirname, `../../${zippath}`));
        });

        archive.on("error", (err) => {
            throw err;
        });
        archive.pipe(output);
        archive.directory(`./public/${reportName}/`, false);
        archive.finalize();

        archive.on("end", (err) => {
            console.log(path.join(__dirname, `../../${zippath}`));
        });

    }
}
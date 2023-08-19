import express from "express";
import path from "path";
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url';
import initRoutes from "./routes/routes.js";
import hbs from "hbs";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Register `hbs` as our view engine using its bound `engine()` function.
app.set("view engine", "hbs");
app.set("views", [
    path.join(__dirname, "views")
])
app.use(express.static(path.join(__dirname, '../public')));
app.use('/static', express.static("static"))

var partialsDir = __dirname + "/views/partials";
var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
        return;
    }
    var name = matches[1];
    var template = fs.readFileSync(partialsDir + "/" + filename, "utf8");
    hbs.registerPartial(name, template);
});

initRoutes(app);


export default app;

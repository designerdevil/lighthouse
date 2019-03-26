const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const log = require('lighthouse-logger');
var rimraf = require("rimraf");
var path = require('path');
var config = require('../config/runtimeConfig');
var { urls } = require('../config/urlConfig');

module.exports = (req, res, next) => {
    res.send("DONE!!!")

    
}
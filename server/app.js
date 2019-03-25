var express = require('express');
var path = require('path');
var initRoutes = require('./routes/routes');

const app = express();


initRoutes(app);


module.exports = app;


const { events, types } = require("../constants/appConstants");

module.exports = (req, res, next) => {
    res.render("layouts/timeline", {
        form: true
    });
}
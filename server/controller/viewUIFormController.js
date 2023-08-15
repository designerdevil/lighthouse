
import constant from "../constants/appConstants.js"

export default (req, res, next) => {
    const { events, types } = constant;
    res.render("layouts/timeline", {
        form: true
    });
}
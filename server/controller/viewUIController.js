
const route = require("../constants/endpoints");
const request = require('request');

module.exports = (req, res, next) => {
    const { brand, type, connection } = req.body;

    const options = {
        url: `http://localhost:4002${route.view}`,
        headers: {
            'x-brand': brand,
            'x-type': type,
            'x-connection-string': connection
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
            return;
        }
        res.send("ERROR")
    }

    request(options, callback);
}

import route from "../constants/endpoints.js"
import fetch from 'node-fetch';

export default async (req, res, next) => {
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

    const response = await fetch(options.url, { ...options });
    const body = await response.text();
    res.send(body);
    request(options, callback);
}
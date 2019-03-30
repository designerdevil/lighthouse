module.exports = (req, res, next) => {
    console.log("Incoming Request")
    if(req.headers['x-github-event'] == 'deployment'){
        res.redirect("/generateWebReport?hook=true")
    }
}
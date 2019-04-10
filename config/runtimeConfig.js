module.exports = {
    output: ["html", "json"], /*["csv", "json", "html"]*/
    chromeFlags: ["--headless"],
    logLevel: "info",
    onlyCategories: [
        "performance",
        "pwa",
        "best-practices",
        "seo",
        "accessibility"
    ],
    view: true
}
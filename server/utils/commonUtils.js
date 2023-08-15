import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import fs from 'fs'
import { rimrafSync } from 'rimraf'
import zlib from 'zlib'

export const launchChromeAndRunLighthouse = async function (
	url,
	opts,
	callback
) {
	const chrome = await chromeLauncher.launch({
		chromeFlags: ['--headless', '--disable-gpu']
	})
	const options = { port: chrome.port, ...opts }
	const runnerResult = await lighthouse(url, options)
	const report = await runnerResult.report
	callback(report)
	await chrome.kill()
}
export const writeFile = function (path, content, shouldGzip) {
	fs.writeFile(path, content, function (fileerr) {
		if (fileerr) {
			return console.log(`Unable to write file ::> ${fileerr}`)
		}
		if (shouldGzip) {
			var gzip = zlib.createGzip()
			var readStream = fs.createReadStream(path)
			var writeStream = fs.createWriteStream(`${path}.js`)
			readStream.pipe(gzip).pipe(writeStream)
			rimrafSync(path)
			fs.rename(`${path}.js`, path, function (err) {
				if (err) throw err
				console.log('File Renamed.')
			})
		}
	})
}
export const downloadFile = function (res, stream, name = 'file') {
	let file = Buffer.from(stream, 'utf8')
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'Content-disposition': `attachment; filename=${name}.html`,
		'Content-Length': file.length
	})
	res.end(file)
}
export const makeNewDir = function () {
	const dateStamp = Date.now()
	console.log(getMomentDate(dateStamp))
	var folderName = `report-on-${getMomentDate(dateStamp)}`
	const date = new Date(parseInt(dateStamp))
	var dir = `./public/${folderName}`
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
		return {
			dirName: dir,
			folderName: folderName,
			date
		}
	}
	return './public'
}
export const getMomentDate = function (dateStamp) {
	const dirName = new Date(dateStamp).toISOString()
	return dirName.replace(/:/g, '_')
}
export const getLocalDate = function (dirName) {
	const dateStamp = dirName.split('report-on-')[1]
	const stampParser = new Date(
		`${dateStamp.replace(/\_/g, ':')}`
	).toLocaleString()
	return stampParser
}
export const getUTCDate = function (dirName) {
	const utcStamp = dirName.split('report-on-')[1]
	return utcStamp.replace(/\_/g, ':')
}
export const sanitizeDirName = function (dirName) {
	const newDname = dirName.replace(/\_/g, '-').replace(/\./g, '-').toLowerCase()
	console.log(newDname)
	return newDname
}

var async = require('async');
var captureConfig = require('./config.json').capture;
var fs = require('fs');
var cp = require('child_process');
var isGecko = process.argv[2] == '-f' ? '--engine=slimerjs ' : '';

var limit = 3;

async.eachLimit(captureConfig, limit, function(item, callback) {
	_capture(encodeURI(item.url), item.viewportWidth, item.output, function(output) {
		console.log(output);
		callback(null);
	});
}, function(err) {
	if (err) {
		console.log('截图出错！');
	} else {
		console.log('所有截图完成');
	}
});

function _capture(url, width, output, complete) {
	var cmd = ['casperjs' + isGecko + ' index.js', url, width, output].join(' ');
	// console.log('child_process ' + cmd);
	cp.exec(cmd, function(err, stdout, strerr) {
		if (err) {
			console.log(err);
		} else {
			if (stdout.indexOf('截图完成') >= 0) {
				complete && complete(stdout);
			}
			if (stdout.indexOf('timeout') >= 0) {
				complete && complete(stdout);
			}
		}
	});
}
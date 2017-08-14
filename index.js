var casper = require('casper').create({
	waitTimeout: 40000
});
var captureConfig = require('./config.json').capture;
var count = 0;
var windowHeight = 0;
var step = 900;
var timer = null;
var sTimer = null;
var querystring = require('querystring');
var url = require('url');
var arrSearch = url.parse(captureConfig.url).query.split('&');
var nAdsLen = 0;
var over = 0;

arrSearch.forEach(function(item, i) {
	if (item.indexOf('zt_ad_preview') >= 0) {
		var adsParams = querystring.parse(item).zt_ad_preview.split(',');
		nAdsLen = adsParams.length;
	}
});

console.log(nAdsLen)

casper.start(captureConfig.url)
	.viewport(captureConfig.viewportWidth, step)
	.then(function() {
		windowHeight = this.getElementBounds('body').height;
		count = Math.ceil(windowHeight / step);
	});

casper.then(function() {
	var self = this;
	goNext(count, step, self.scrollTo, function() {
		setTimeout(function() {
			over = 1;
		}, 2000);
	});
});

casper.then(function() {
	var self = this;
	sTimer = setInterval(function() {
		if (over) {
			clearInterval(sTimer);
			self.echo('zt: ' + self.evaluate(function() {
				return document.querySelectorAll('[data-ad-tag]').length;
			}));
			setTimeout(function() {
				self.capture(captureConfig.output);
				self.exit();
			}, 2000);
		}
	}, 500);
});

casper.waitFor(function() {
	return false;
});

casper.run();

function goNext(num, step, cb, complete) {
	var n = 0;
	timer = setInterval(function() {
		n++;
		cb.call(casper, 0, n * step);
		console.log('scrolling: ' + n * step);
		if (n >= num) {
			clearInterval(timer);
			console.log('complete');
			complete();
		}
	}, 500);
}
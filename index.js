var casper = require('casper').create({
	waitTimeout: 20000
});

var captureConfig = require('./config.json').capture;
var count = 0;
var windowHeight = 0;
var step = 900;
var timer = null;

casper.on('page.error', function(msg) {
	this.echo('pageError: ' + msg);
});

casper.on('resource', function(resource) {
	this.echo(resource.url);
});

casper.start(captureConfig.url)
	.viewport(captureConfig.viewportWidth, step)
	.then(function() {
		windowHeight = this.getElementBounds('body').height;
		count = Math.ceil(windowHeight / step);
	});

casper.then(function() {
	var self = this;
	goNext(count, step, self.scrollTo, function() {
		windowHeight = self.getElementBounds('body').height;
		self.echo('截图中 ...');
		setTimeout(function() {
			self.capture(captureConfig.output, {
				top: 0,
				left: 0,
				width: captureConfig.viewportWidth,
				height: windowHeight
			});
			self.exit();
		}, 2000);
	});
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
		console.log('页面滚动至: ' + n * step + 'px');
		if (n >= num) {
			clearInterval(timer);
			console.log('页面滚动至最底部');
			complete();
		}
	}, 800);
}
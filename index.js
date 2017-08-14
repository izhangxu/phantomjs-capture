var casper = require('casper').create({
	waitTimeout: 30000
});
var captureConfig = require('./config.json').capture;
var count = 0;
var windowHeight = 0;
var step = 900;
var timer = null;

casper.start(captureConfig.url)
	.viewport(captureConfig.viewportWidth, step)
	.then(function() {
		windowHeight = this.getElementBounds('body').height;
		count = Math.ceil(windowHeight / step);
	});

casper.then(function() {
	// console.log(count, step);
	var self = this;
	goNext(count, step, self.scrollTo, function() {
		setTimeout(function(){
			self.capture(captureConfig.output);	
			self.exit();
		}, 2000);
	});
});

casper.waitForResource(/end-png/g, function() {
	this.echo('end');
});

casper.run();

function goNext(num, step, cb, complete) {
	var n = 0;
	timer = setInterval(function() {
		n++;
		cb.call(casper, 0, n * step);
		console.log('scrolling');
		if (n >= num) {
			clearInterval(timer);
			console.log('complete');
			complete();
		}
	}, 800);
}
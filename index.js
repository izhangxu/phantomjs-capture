var casper = require('casper').create({
	waitTimeout: 20000
});
var count = 0;
var windowHeight = 0;
var step = 900;
var timer = null;

casper.start('http://bj.leju.com').viewport(1400, step).then(function() {
	windowHeight = this.getElementBounds('body').height;
	count = Math.ceil(windowHeight / step);
});

casper.then(function() {
	// console.log(count, step);
	var self = this;
	goNext(count, step, self.scrollTo, function() {
		self.capture("./leju2.png");
		self.exit();
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
	}, 500);
}
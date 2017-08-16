var casper = require('casper').create({
	waitTimeout: 20000
});

var args = casper.cli;

var cUrl = args.get(0),
	cViewportWidth = Number(args.get(1)),
	cOutput = args.get(2),
	count = 0,
	windowHeight = 0,
	step = 900,
	timer = null;
// console.log(cUrl, cViewportWidth, cOutput);

casper.echo('url: ' + cUrl);

casper.on('page.error', function(msg) {
	this.echo('pageError: ' + msg);
});

// casper.on('resource.received', function(resource) {
// 	this.echo(resource.url);
// });

casper.on('waitFor.timeout', function(resource) {
	this.echo('waitFor.timeout');
});

casper.start(cUrl)
	.viewport(cViewportWidth, step)
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
			self.capture(cOutput, {
				top: 0,
				left: 0,
				width: cViewportWidth,
				height: windowHeight
			}, {
				format: 'jpg',
				quality: 75
			});
			self.echo('截图完成: ' + cOutput);
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
			complete();
		}
	}, 800);
}
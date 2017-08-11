const phantom = require('phantom');
const pify = require('pify');

let sitpage = null;
let phInstance = null;
let windowH = 0;

phantom.create()
	.then(instance => {
		phInstance = instance;
		return phInstance.createPage();
	})
	.then(page => {
		sitpage = page;
		return page.open('http://bj.leju.com');
	})
	.then(status => {
		console.log('status ' + status);
		return sitpage.evaluate(function() {
			window.scrollTo(0, 20000);
			return document.getElementsByTagName('html')[0].getBoundingClientRect().height;
		});
	})
	.then(height => {
		console.log('page height: ' + height);
		windowH = height;
		phInstance.exit();
		phInstance = null;
		sitpage = null;
		return phantom.create();
	})
	.then(instance => {
		phInstance = instance;
		return phInstance.createPage();
	})
	.then(page => {
		sitpage = page;
		return sitpage.property('viewportSize', {
			width: 1200,
			height: windowH
		});
	})
	.then(p => {
		console.log('p: ' + p);
		return sitpage.open('http://bj.leju.com');
	})
	.then(status => {
		console.log('status: '+ status);
		setTimeout(function() {
			sitpage.render('./output/3.jpg');
			phInstance.exit();
		}, 2000);
	})
	.catch(error => {
		console.log(error);
		phInstance.exit();
	});
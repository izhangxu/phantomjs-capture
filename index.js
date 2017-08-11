const phantom = require('phantom');
const pify = require('pify');

let sitpage = null;
let phInstance = null;
let windowH = 0;
let arr = [{
	"dom": "#lj_car",
	"urlkeyword": "LJcore;public/LJselector;public/LJajax"
}, {
	"dom": "#t02",
	"urlkeyword": "getFmtVideoNew"
}];

let scrollPage = function(page, dom, keyword) {
	console.log(dom, keyword)
	return page.evaluate(function(ele) {
		return document.querySelector(ele).offsetTop;
	}, dom).then(function(top) {
		console.log(top)
		let script1 = "function(){ window.scrollTo(0, 500); }";
		return page.evaluateJavaScript(script1);
	});
};

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
		sitpage.on('onConsoleMessage', function(msg, lineNum, sourceId) {
			console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
		});
		return sitpage.evaluate(function() {
			return document.getElementsByTagName('html')[0].getBoundingClientRect().height;
		});
	})
	.then(height => {
		console.log('page height: ' + height);
		windowH = height;
		sitpage.close();
		return phInstance.createPage();
	})
	.then(page => {
		sitpage = page;
		sitpage.on('onResourceRequested', function(requestData) {
			let match = requestData.url.match(/(getFmtVideoNew)/g);
			if (match) {
				console.log('Request (#' + requestData.url + ')');
				setTimeout(function() {
					page.render('./output/4 ' + arr.length + '.jpg');
					arr.splice(0, 1);
					if (!arr.length) {
						phInstance.exit();
					}
				}, 2000);
			}
		});
		return sitpage.property('viewportSize', {
			width: 1200,
			height: windowH
		});
	})
	.then(_ => {
		return sitpage.open('http://bj.leju.com');
	})
	.then(status => {
		console.log('status: ' + status);
		Promise.all(arr.forEach(function(item) {
			scrollPage(sitpage, item.dom, item.urlkeyword);
		}));
	})
	.then(k => {
		console.log(k)
	})
	.catch(error => {
		console.log(error);
		phInstance.exit();
	});
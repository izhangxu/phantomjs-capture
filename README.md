# phantomjs-capture

使用phantomjs、casperjs、slimerjs模拟页面滚动，触发懒加载、异步请求、页面滚动后执行的函数，实现截图。

记录一次坑爹的截图经过，casperjs下会对当前页面中的请求都会encodeurl后发送，但是项目中有个ajax需要先对当前页面链接上的query参数进行分割重组后，当做异步请求的参数发送，此时分割query参数会出错。所以引入了slimerjs，使用firefox浏览器进行处理。

[phantomjs](http://phantomjs.org/) 无头浏览器，能做自动化测试，截图，查看网络请求，爬虫，论坛自动登录打卡...

[casperjs](http://casperjs.org/) 在Webkit（chrome）内核下使用。

[slimerjs](https://slimerjs.org/) 在Gecko（Firefox）内核下使用。最新版本v0.10.3，默认兼容ff浏览器（minVersion >= 38.0.0、maxVersion <= 52.*）版本以内。今天（2017-08-15）我的mac ff版本是54.0.1，怎么破？官网介绍这么说--
> However, you can change this limitation, by modifying the maxVersion parameter (and/or the minVersion) in the application.ini of SlimerJS. But remember you do it at your own risk.

打开slimerjs包中的application.ini（mac路径：/usr/local/lib/node_modules/slimerjs/src）下修改`maxVersion=54.*`。

## 说明
 - 支持批量截图
 - 模拟页面滚动，支持截取使用懒加载的页面

## 安装

```
$ git clone git@github.com:izhangxu/image-optimize.git
$ npm install casperjs -g
$ npm install slimerjs -g
```

## 截图

在根目录`config.json`文件中`capture(type: array)`参数加入链接、截图宽度、输出路径。运行命令：
```
$ node manager.js
$ node manager.js -f // 用火狐浏览器截图
``` 
之后在输出路径中查看图片。

## License
[MIT](https://github.com/izhangxu/phantomjs-capture/blob/master/LICENSE)

var cheerio = require('cheerio');
var request = require('request');
var fs = require("fs");
var schedule = require('node-schedule');

//爬虫抓取
function getNews(){
	request({
	url: 'http://wh.leju.com/#source=pc_sina_tydh1&source_ext=pc_sina',
	gzip: true
}, function(err, response, body) {
	if (err) {
		return console.log(err);
	} else {
		callback(body);
	}
});}

//处理网页数据
function callback(html) {

	//使用load方法，参数是刚才获取的html源代码数据
	var $ = cheerio.load(html);
	var arrUrl = [];

	var point = $('.ty_News_M').find('a');
	//获取元素
	point.each(function(index, element) {
		var href = $(element).attr('href');
		var title = $(element).text();

		arrUrl.push(title + ',' + href);

	});

	createNews('./data',arrUrl);
}

//创建文件
function createNews(path, content) {
	fs.writeFile(path + "news.txt", content, function(err) {
		if (err) {
			return console.log(err);
		}
		console.log("The news was saved!");
	});
}

//每天八点定时操作
    var rule = new schedule.RecurrenceRule();  
    rule.dayOfWeek = [0, new schedule.Range(1, 6)];
　　rule.hour = 8;
　　rule.minute = 0;

　　var j = schedule.scheduleJob(rule, function(){
        getNews();
　　　　console.log("今天新闻已更新"+ new Date());

　　});
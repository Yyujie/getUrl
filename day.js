
var cheerio = require('cheerio');
var request = require('request');
var fs = require("fs");
var schedule = require('node-schedule');

//爬虫函数
function getWeather(){
	request({
	url: 'http://www.tianqi.com/wuhan/',
	gzip: true
}, function(err, response, body) {
	if (err) {
		return console.log(err);
	} else {
		callback(body);
	}
});
}

//处理网页数据
function callback(html) {

	//使用load方法，参数是刚才获取的html源代码数据
	var $ = cheerio.load(html);
	var arrDays = [];
	var arrWeas = [];

	var Days = $('.week').find('li');
	var Weas = $('.txt2').find('li');

	//获取元素
	Days.each(function(index, element) {
		var content = $(element).text();
		arrDays.push(content);
	});
	Weas.each(function(index, element) {
		var content = $(element).text();
		arrWeas.push(content);
	});

	arr = arrDays + ',' + arrWeas
	createNews('days.txt', arr);


}

//创建文件
function createNews(path, content) {
	fs.writeFile(path, content, function(err) {
		if (err) {
			return console.log(err);
		}
		console.log("The days was saved!");
	});
}

//每小时更新一次
    var rule = new schedule.RecurrenceRule();  
    var times = [];  
    for(var i=1; i<24; i++){
　　　　times.push(i);
　　}
    rule.hour = times;  
    schedule.scheduleJob(rule, function(){  
       getWeather(); 
       console.log("今天天气已更新"+ new Date());
    });  

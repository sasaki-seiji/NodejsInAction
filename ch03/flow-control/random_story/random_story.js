var fs = require('fs');
var request = require('request');
// 2018.02.03 change
//var htmlparser = require('htmlparser');
var htmlparser = require('htmlparser2');
var configFilename = './rss_feeds.txt';

function checkForRSSFile () {
  fs.exists(configFilename, function(exists) {
    if (!exists)
      return next(new Error('Missing RSS file: ' + configFilename));

    next(null, configFilename);
  });
}

function readRSSFile (configFilename) {
  fs.readFile(configFilename, function(err, feedList) {
    if (err) return next(err);

    feedList = feedList
               .toString()
               .replace(/^\s+|\s+$/g, '')
               .split("\n");
    var random = Math.floor(Math.random()*feedList.length);
    next(null, feedList[random]);
  });
}

function downloadRSSFeed (feedUrl) {
  request({uri: feedUrl}, function(err, res, body) {
    if (err) return next(err);
    if (res.statusCode != 200)
      return next(new Error('Abnormal response status code'))

    next(null, body);
  });
}

function parseRSSFeed (rss) {
  var handler = new htmlparser.FeedHandler();
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);

	// debug
	console.log('handler.dom.items:\n', handler.dom.items);
	
  if (!handler.dom.items.length)
    return next(new Error('No RSS items found'));

  var item = handler.dom.items.shift();
  /* 2018.02.04 change
  console.log(item.title);
  console.log(item.link);
  */
  console.log(item.id);
  console.log(item.description);
}

var tasks = [ checkForRSSFile,
              readRSSFile,
              downloadRSSFeed,
              parseRSSFeed ];

function next(err, result) {
  if (err) throw err;

  var currentTask = tasks.shift();

  if (currentTask) {
    currentTask(result);
  }
}

next();

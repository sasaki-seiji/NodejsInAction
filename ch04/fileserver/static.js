var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;

var server = http.createServer(function(req, res){
	var url = parse(req.url);
	var path = join(__dirname, url.pathname);
	var stream = fs.createReadStream(path);
	
/* 4.3.1: optimize data transfer using Stream#pipe()
	stream.on('data', function(chunk){
		res.write(chunk);
	});
	stream.on('end', function(){
		res.end();
	});
*/
	stream.pipe(res);
	// 4.3.2: handle server error
	stream.on('error', function(err) {
		res.statusCode = 500;
		res.end('Internal Server Error');
	});
	
});

server.listen(3000);


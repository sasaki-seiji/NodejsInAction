var fs = require('fs');
fs.readFile('./resource.json', function(er, data) {
	if (er) throw er;
	console.log(data);
});

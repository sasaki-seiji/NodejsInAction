var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/tasks');

var Schema = mongoose.Schema;
var Tasks = new Schema({
  project: String,
  description: String
});
mongoose.model('Task', Tasks);

var Task = mongoose.model('Task');
/* 2018.02.12 modify
Task.find(
	{'project': 'Bikeshed'},
	function(err, task) {
		if (err) throw err;
		task.remove();
		mongoose.disconnect();
	}
);
*/
Task.remove(
	{'project': 'Bikeshed'},
	function(err) {
		if (err) throw err;
		console.log('remove all');
		mongoose.disconnect();
	}
);


var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/tasks');

var Schema = mongoose.Schema;
var Tasks = new Schema({
  project: String,
  description: String
});
mongoose.model('Task', Tasks);

var Task = mongoose.model('Task');
Task.update(
	{'project': 'Bikeshed'},
	{'description': 'Paint the bikeshed green.'},
	{multi: false},
	function(err, rows_updated) {
		if (err) throw err;
		console.log('Updated: ', rows_updated);
		mongoose.disconnect();
	}
);



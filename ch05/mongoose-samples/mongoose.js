var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/tasks');

var Schema = mongoose.Schema;
var Tasks = new Schema({
  project: String,
  description: String
});
mongoose.model('Task', Tasks);

var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function(err) {
  if (err) throw err;
  console.log('Task saved.');

	// 2018.02.12 move here 
	Task.find({'project': 'Bikeshed'}, function(err, tasks) {

		// 2018.02.12 add
		console.log('tasks: ', tasks);
	
		for (var i = 0; i < tasks.length; i++) {
		  console.log('ID:' + tasks[i]._id);
		  console.log(tasks[i].description);
		}
		
		// 2018.02.12 add
		mongoose.disconnect();
	});
});

/* 2018.02.12 move into above callback
var Task = mongoose.model('Task');
Task.find({'project': 'Bikeshed'}, function(err, tasks) {

	// 2018.02.12 add
	console.log('tasks: ', tasks);
	
  for (var i = 0; i < tasks.length; i++) {
    console.log('ID:' + tasks[i]._id);
    console.log(tasks[i].description);
  }
});
*/

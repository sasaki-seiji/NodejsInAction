var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var dbName = 'mydatabase';

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  console.log('Connected successfully to server');

  var db = client.db(dbName);
	db.collection('test_insert', function(err, 	collection) {
    if (err) throw err;

    collection.find({"title": "I like cake"}).toArray(
    	function(err, results) {
        if (err) throw err;
        console.log(results);
      }
    );
    client.close();
  });
});


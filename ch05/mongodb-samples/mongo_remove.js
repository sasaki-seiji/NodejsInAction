var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var dbName = 'mydatabase';

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  console.log('Connected successfully to server');

  var db = client.db(dbName);
	db.collection('test_insert', function(err, 	collection) {
    if (err) throw err;

    collection.remove({"title": "I like cake"}, {safe: true}, function(err) {
			if (err) throw err;
    });

    collection.remove({"title": "I ate too much cake"}, {safe: true},
    function(err) {
				if (err) throw err;
    });

    client.close();
  });
});


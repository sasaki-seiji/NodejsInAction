/* 2018.02.12 modify
var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('mydatabase', server, {w: 1});

client.open(function(err) {
  if (err) throw err;
  client.collection('test_insert', function(err, collection) {
    if (err) throw err;

    var _id = new client.bson_serializer .ObjectID('4e650d344ac74b5a01000001');
    collection.update(
      {_id: _id},
      {$set: {"title": "I ate too much cake"}},
      {safe: true},
      function(err) {
        if (err) throw err;
      }
    );
  });
});
*/

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var dbName = 'mydatabase';

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  console.log('Connected successfully to server');

  var db = client.db(dbName);
	db.collection('test_insert', function(err, 	collection) {
    if (err) throw err;

    collection.update(
    	// 2018.02.12 change
    	//{ _id: _id },
      {"title": "I like cake"},
      {$set: {"title": "I ate too much cake"}},
      {safe: true},
      function(err) {
        if (err) throw err;
      }
    );
    client.close();
  });
});


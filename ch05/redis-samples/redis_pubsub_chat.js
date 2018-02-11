var net = require('net');
var redis = require('redis');

var server = net.createServer(function(socket) {
  var subscriber;
  var publisher;

/* 2018.02.11 delete
  socket.on('connect', function() {
*/
    console.log('new connection');

    subscriber = redis.createClient();
    subscriber.subscribe('main_chat_room');

    subscriber.on('message', function(channel, message) {
      socket.write('Channel ' + channel + ': ' + message);
    });

    publisher = redis.createClient();
/*
  });
*/
  socket.on('data', function(data) {
    publisher.publish('main_chat_room', data);
  });

  socket.on('end', function() {
    console.log('end');

    subscriber.unsubscribe('main_chat_room');
/* 2018.02.11 change: clean end
    subscriber.end();
    publisher.end();
*/
    subscriber.quit();
    publisher.quit();
  });
});

server.listen(3000);

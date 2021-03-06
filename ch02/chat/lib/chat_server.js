var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

// list 2-7
exports.listen = function(server) {
	
	io = socketio.listen(server);
	io.set('log level', 1);
	
	io.sockets.on('connection', function(socket) {
		
		guestNumber = assignGuestName(socket, guestNumber, 
			nickNames, namesUsed);
			
		joinRoom(socket, 'Lobby');
		
		handleMessageBroadcasting(socket, nickNames);
		
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		
		handleRoomJoining(socket);
		
		socket.on('rooms', function() {
			// debug
//			console.log('io.sockets.adapter.rooms: ', io.sockets.adapter.rooms);

// 2018.01.29 change
//			socket.emit('rooms', io.sockets.manager.rooms);
			var rooms = {}; // rooms table
			for (id in currentRoom) {
				rooms[currentRoom[id]] = true;
			}
			socket.emit('rooms', rooms);
		});
		
		handleClientDisconnection(socket, nickNames, namesUsed);
		
	});
	
};

// list 2-8
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	var name = 'Guest' + guestNumber;
	nickNames[socket.id] = name;
	
	socket.emit('nameResult', { 
		success: true,
		name: name
	});
	namesUsed.push(name);

	return guestNumber + 1;
}

// list 2-9
function joinRoom(socket, room) {
	socket.join(room);
	
	currentRoom[socket.id] = room;
	
	socket.emit('joinResult', {room: room});
	
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	});

	// 2018.01.29 change
/*		
	var usersInRoom = io.sockets.clients(room);
		
	if (usersInRoom.length > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for (var index in usersInRoom) {
			var userSocketId = usersInRoom[index].id;
			if (userSocketId != socket.id) {
				if (index > 0) {
					usersInRoomSummary += ', ';
				}
				usersInRoomSummary += nickNames[userSocketId];
			}
		}
		usersInRoomSummary +=  '.';
		socket.emit('message', {text: usersInRoomSummary});
	}
*/
	var usersInRoomSummary = 'Users currently in ' + room + ': ';
	var count = 0;
	for (var id in currentRoom) {
		if (id != socket.id && currentRoom[id] == room) {
			if (count > 0) {
				usersInRoomSummary += ', ';
			}
			usersInRoomSummary += nickNames[id];
			count++;
		}
	}
	if (count > 0) {
		usersInRoomSummary +=  '.';
		socket.emit('message', {text: usersInRoomSummary});
	}
}

// list 2-10
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
	socket.on('nameAttempt', function(name) {
		if (name.indexOf('Guest') == 0) {
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "Guest".'
			});
		}
		else {
			if (namesUsed.indexOf(name) == -1) {
				var previousName = nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name);
				nickNames[socket.id] = name;
				delete namesUsed[previousNameIndex];
				
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				});
			}
			else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				});
			}
		}
	});
}

function handleMessageBroadcasting(socket) {
	socket.on('message', function(message) {
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ': ' + message.text
		});
	});
}

function handleRoomJoining(socket) {
	socket.on('join', function(room) {
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, room.newRoom);
	});
}

function handleClientDisconnection(socket, nickNames, namesUsed) {
	socket.on('disconnect', function() {
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nickNames[socket.id];
	});
}


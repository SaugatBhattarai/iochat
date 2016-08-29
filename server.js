var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000,'0.0.0.0');
console.log('Server Running');

app.get('/',function(req,res){
	res.sendFile(__dirname +'/index.html');
});

//open connection with socket io
io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log("Connected: %s sockets connected",connections.length);

	// function updateUsername(){
	// 	io.sockets.emit('get users',users);
	// }
	
	//Disconnect
	socket.on('disconnect',function(data){
		// if(!socket.username) return;
		users.splice(users.indexOf(socket.username),1);
		updateUsername();
		connections.splice(connections.indexOf(socket),1);
		console.log("Disconnected: %s sockets connected",connections.length);
	});

	//Send Message
	socket.on('send message',function(data){   //caught send message
		console.log(socket.username);
		io.sockets.emit('new message',{msg:data,user:socket.username}); //emit caught message
	});

	socket.on('new user',function(data,callback){
		// console.log(data);
		callback(true);
		socket.username=data;
		users.push(socket.username);
		updateUsername();
	});

	function updateUsername(){
		io.sockets.emit('get users',users);
	}
});

//pusher

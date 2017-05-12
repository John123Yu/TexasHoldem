const gameSetup = require('../app/setup');
const gamePlay = require('../app/gamePlay');
const Player = gameSetup.Player;
let firstDeck = gameSetup.firstDeck;
var startGame = gamePlay.startGame;

var users = [];
var messages = [];
var playersReady = 0;

var is_user = function(user) {
	var users_count = users.length;
	for(var i = 0; i < users_count; i++) {
		if(user == users[i]) {
			return true;
		}
	}
	return false;
}

module.exports = function Route(app, server) {
	app.get('/', function(req, res) {
	 res.render("index");
	})

	var io = require('socket.io').listen(server);

	io.sockets.on('connection', function (socket) {
	  console.log("WE ARE USING SOCKETS!");
	  console.log(socket.id);
	  //all the socket code goes in here!
	  socket.on('page_load', function(data) {
	  	if(is_user(data.name)) {
	  		socket.emit('existing_user', {error: 'this user already exists'})
	  	} else {
	  		let newPlayer = new Player(data.name, data.buyin);
	  		users.push(newPlayer);
	  		socket.emit('load_messages', {current_user: newPlayer, messages: messages})
	  	}
	  })

	  socket.on('start_action', function(data) {
	  	playersReady++;
	  	if(playersReady === users.length){
	  		startGame(firstDeck, users);
		  	io.emit('dealt_cards', {users: users});
	  	}
	  })





	  socket.on('new_message', function(data) {
	  	messages.push({name: data.user.name, message: data.message});
	  	io.emit("post_new_message", {new_message: data.message, user: data.user.name})
	  })
	})
}
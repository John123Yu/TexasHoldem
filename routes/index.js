const gameSetup = require('../app/setup');
const gamePlay = require('../app/gamePlay');
const Player = gameSetup.Player;
let firstDeck = gameSetup.firstDeck;
const startGame = gamePlay.startGame;
const firstRound = gamePlay.firstRound;

var users = [];
var players = [];
var messages = [];
var playersReady = 0;
let pot;
let highestBet;

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
	  		console.log(newPlayer.action);
	  		socket.emit('initiate_player', {
	  			messages,
	  			user: newPlayer
	  		})
	  	}
	  })

	  socket.on('start_action', function(data) {
	  	playersReady++;
	  	if(playersReady === users.length){
	  		players = users;
	  		pot = startGame(firstDeck, players);
		  	io.emit('dealt_cards', {
		  		players
		  	});
	  	}
	  })

	  socket.on('first_act', function(data){
	  	let nextPosition;
	  	let user;
	  	for(let item of players) {
	  		if(data.user.name === item.name) {
	  			user = item;
	  		}
	  	}
	  	console.log(user);
	  	if(data.position === 2 && players.length > 2) {
	  		if(players.length > 3) {
				nextPosition = 3;	  			
	  		} else {
	  			nextPosition = 0;
	  		}
	  		pot_highestBet = firstRound( user, players, data.action, data.amount);
	  		// let filteredPlayers = players.map( onePlayer => {
	  		// 	onePlayer.hand = "You can't see this";
	  		// 	return onePlayer;
	  		// })
	  		io.emit('first_round', {
	  			nextPosition,
	  			pot: pot_highestBet[0],
	  			highestBet: pot_highestBet[1],
	  			players: pot_highestBet[2]
	  		})
	  	}
	  	if(data.position === 0 && players.length > 2) {
	  		nextPosition = 1;
	  		pot_highestBet = firstRound( user, players, data.action, data.amount);
	  		io.emit('first_round', {
	  			nextPosition,
	  			pot: pot_highestBet[0],
	  			highestBet: pot_highestBet[1],
	  			players: pot_highestBet[2]
	  		})
	  	}
	  })





	  socket.on('new_message', function(data) {
	  	messages.push({
	  		name: data.user.name,
	  		message: data.message
	  	});
	  	io.emit("post_new_message", {
	  		new_message: data.message,
	  		user: data.user.name
	  	})
	  })
	})
}
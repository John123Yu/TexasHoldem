const gameSetup = require('../app/setup');
const Player = gameSetup.Player;
let firstDeck = gameSetup.firstDeck;
let Board = gameSetup.Board;
const gamePlay = require('../app/gamePlay');
const startGame = gamePlay.startGame;
const firstRound = gamePlay.firstRound;

let users = [];
let players = [];
let messages = [];
let playersReady = 0;
let pot = 0;
let highestBet;
let nextPosition;
let lastToAct;
let round;
let board = new Board();
let outCount = 1;
let oneEnd = true;

module.exports = function Route(app, server) {

app.get('/', function(req, res) {
 res.render("index");
})

const io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");

  socket.on('page_load', function(data) {
  	if(is_user(data.name)) {
  		socket.emit('existing_user', {error: 'this user already exists'})
  	} else {
  		let newPlayer = new Player(data.name, data.buyin);
  		users.push(newPlayer);
  		socket.emit('initiate_player', {
  			messages,
  			user: newPlayer
  		})
  	}
  })

  socket.on('start_action', function(data) {
  	playersReady++;
  	round = 1;
  	if(playersReady === users.length){
  		players = users;
  		nextPosition = nextPositionCalc(1, players);
  		pot = startGame(firstDeck, players, pot);
  		highestBet = .2;
	  	io.emit('one_round', { 
	  		nextPosition,
	  		pot,
	  		highestBet,
	  		players,
	  		board,
	  		round
	  	});
  	}
  })

  socket.on('act', function(data){
  	let lastToAct = lastToActCalc(data.action);
  	if(lastToAct === 'game_done') { 
  		console.log("HEYO");
  		return; }
  	else if(lastToAct === 'new_round') {
  		highestBet = 0;
  		io.emit('one_round', { 
		nextPosition,
  		pot,
  		highestBet,
  		players,
  		board,
  		round
	})
  	}
  	console.log(data);
  	let user;
  	if(data.action != 'out' && data.action != 'pass'){
	  	for(let item of players) {
	  		if(data.user.name === item.name) {
	  			user = item;
	  		}
	  	}

  	}
  	if(data.position === nextPosition && oneEnd) {
  		if(data.action !== 'out' && data.action != 'pass') {
	  		pot_highestBet = firstRound( user, players, data.action, data.amount, pot, highestBet);
	  		pot = pot_highestBet[0];
	  		highestBet = pot_highestBet[1];
	  		players = pot_highestBet[2];
  		}
  		nextPosition = nextPositionCalc(nextPosition, players);
  		io.emit('one_round', {
  			nextPosition,
  			pot,
  			highestBet,
  			players,
  			board,
  			round
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

  function newGame() {
	io.emit('end_game', { message: 'The game has ended' })
  }
  
  function lastToActCalc(action) {
  	if(action === 'out'){
  		outCount++;
  	}
	if(outCount == players.length || round === 4 && nextPosition == players.length - 1) {
		if(oneEnd){
			newGame();
			oneEnd = false;
		}
		return 'game_done';
	}
	if(action === 'raise') {
		return false;
	}
	if(round == 1) {
		if(nextPosition == 1) {
			boardAction(firstDeck);
			return 'new_round';

		}
	} else {
		if(nextPosition == players.length - 1) {
			boardAction(firstDeck);
			return 'new_round';
		}
	}
  }

  function boardAction(deck) {
	if(round === 1) {
		board.flop(deck);
	} else if(round > 1 && round < 4){
		board.turnOrRiver(deck);
	}
	round++;
	nextPosition = 0;
  }

})
}

function nextPositionCalc(nextPosition, players) {
	nextPosition++;
	if(!players[nextPosition]) {
		nextPosition = 0;
	}
	return nextPosition;
}

var is_user = function(user) {
	var users_count = users.length;
	for(var i = 0; i < users_count; i++) {
		if(user == users[i]) {
			return true;
		}
	}
	return false;
}

// let filteredPlayers = players.map( onePlayer => {
// 	onePlayer.hand = "You can't see this";
// 	return onePlayer;
// })


var control = require('../server/controllers/controls.js');
const gameSetup = require('./setup');
const Player = gameSetup.Player;
let firstDeck = gameSetup.firstDeck;
let Board = gameSetup.Board;
const gamePlay = require('./gamePlay');
const startGame = gamePlay.startGame;
const firstRound = gamePlay.firstRound;
const nextPositionCalc = gamePlay.nextPositionCalc;
const is_user = gamePlay.is_user;

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
let newRound;
let lastRaise;

module.exports = function Route(app, server) {
// -----------------------------------------------------//
// -----------------------------------------------------//
app.get('/', (req, res) => {
 res.render("index");
})
app.post('/user',function(req, res){
  control.create(req, res)
});
app.post('/login',function(req, res){
  control.login(req, res)
});
// -----------------------------------------------------//
// -----------------------------------------------------//
const io = require('socket.io').listen(server);

io.sockets.on('connection', socket => {

  console.log("WE ARE USING SOCKETS!");
  
  socket.on('page_load', data => {
  	if(is_user(data.name, users)) {
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

  socket.on('new_message', data => {
  	messages.push({
  		name: data.user.name,
  		message: data.message
  	});
  	io.emit("post_new_message", {
  		new_message: data.message,
  		user: data.user.name
  	})
  })

  socket.on('start_action', data => {
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

  socket.on('act', data => {
    console.log("DATA ", data);
    let lastToAct = lastToActCalc(data.action);
    if(lastToAct === 'game_done') { return; }
    let user = players.filter(function(player){
      return player.name === data.user.name;
    })
    console.log(user);
    console.log("data position", data.position);
    console.log("next position", nextPosition);
    console.log("ONEEND", oneEnd)
    if(data.position == nextPosition && oneEnd) {
      console.log("HEYO")
      if(data.action !== 'fold' && data.action != 'pass') {
        pot_highestBet = firstRound( user[0], players, data.action, data.amount, pot, highestBet, data.investment);
        pot = pot_highestBet[0];
        highestBet = pot_highestBet[1];
        players = pot_highestBet[2];
      }
      nextPosition = nextPositionCalc(nextPosition, players);
      if(lastToAct === 'new_round' || lastRaise === nextPosition){
        highestBet = 0;
        nextPosition = 0;
        newRound = true;
        lastRaise = null;
        boardAction(firstDeck);
      } 
      io.emit('one_round', {
        nextPosition,
        pot,
        highestBet,
        players,
        board,
        round,
        newRound
      })
    }
  })


  function newGame() {
    firstDeck.reset();
    playersReady = 0;
    board = new Board();
    pot = 0;
    highestBet = 0;
    outCount = 1;
    oneEnd = true;
    lastRaise = null;
    nextPosition = 0;
    for(let player of players) {
      player.hand = [];
    }
    io.emit('end_game', { 
      message: 'The game has ended',
      round: 1,
      players
    });
  }
  
  function lastToActCalc(action) {
    console.log("outCount", outCount);
    if(action === 'fold') { outCount++; }
  	if(outCount == players.length || round === 4 && nextPosition == players.length - 1) {
      console.log("GAME DONE")
  		if(oneEnd){
  			oneEnd = false;
        newGame();
  		}
  		return 'game_done';
  	}
  	if(action === 'raise') {
      lastRaise = nextPosition;
  		return false;
  	}
  	if(round == 1) {
  		if(nextPosition == 1) {
  			return 'new_round';
  		}
  	} else {
  		if(nextPosition == players.length - 1) {
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
  }

})
}

// let filteredPlayers = players.map( onePlayer => {
// 	onePlayer.hand = "You can't see this";
// 	return onePlayer;
// })


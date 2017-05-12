const gameSetup = require('./setup');
const Player = gameSetup.Player;
let firstDeck = gameSetup.firstDeck;

let pot = 0;
let highestBet;

module.exports = {
	startGame(Deck, Players) {
		Deck.shuffle();
		pot = Players[0].smallBlind() + Players[1].bigBlind();
		for(let i = 0; i < 2; i++) {
			Players.forEach( player => {
				player.takeCard(Deck);
			})
		}
		highestBet = .2;
		return pot;
	},
	firstToAct(player, players, action, amount) {
		console.log(player);
		if(action === 'raise') {
			pot += player.action('raise', amount)[1];
			highestBet = amount;
		} else if (action === 'call') {
			pot += player.action('call', .2)[1];
		} else {
			players = players.filter( removePlayer => {
				return removePlayer.name != player.name;
			})
		}
		players = players.map( thisPlayer => {
			if(thisPlayer.name === player.name) {
				return player;
			}
		})
		return [pot, highBet];
	}
}

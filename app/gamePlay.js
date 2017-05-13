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
	firstRound(user, players, action, amount) {
		console.log(user);
		if(action === 'raise') {
			pot += Number(user.action('raise', amount));
			highestBet = amount;
		} else if (action === 'call') {
			pot += Number(user.action('call', amount));
		} else {
			players = players.filter( removePlayer => {
				return removePlayer.name != user.name;
			})
		}
		return [pot, highestBet, players];
	}
}

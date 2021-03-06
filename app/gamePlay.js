const gameSetup = require('./setup');
const Player = gameSetup.Player;
let firstDeck = gameSetup.firstDeck;

module.exports = {
	startGame(Deck, Players, pot, highestBet = .2) {
		Deck.shuffle();
		pot = Players[0].smallBlind() + Players[1].bigBlind();
		for(let i = 0; i < 2; i++) {
			Players.forEach( player => {
				player.takeCard(Deck);
			})
		}
		return pot;
	},
	firstRound(user, players, action, amount, pot, highestBet, investment) {
		if(action === 'raise' || action === 'call') {
			pot += Number(user.action('raise', amount));
			// console.log("amount ", amount)
			// console.log("investment ", investment)
			highestBet = investment;
		} else if (action ==='check') {
			// continue
		} else if (action === 'fold') {
			// players = players.filter( removePlayer => {
			// 	return removePlayer.name != user.name;
			// })
		}
		return [pot, highestBet, players];
	},
	nextPositionCalc(nextPosition, players) {
		do {
			nextPosition++;
			if(!players[nextPosition])
				nextPosition = 0;
		} while (players[nextPosition].folded);
		return nextPosition;
	},
	is_user(user, users) {
		var users_count = users.length;
		for(var i = 0; i < users_count; i++) {
			if(user == users[i])
				return true;
		}
		return false;
	}
}

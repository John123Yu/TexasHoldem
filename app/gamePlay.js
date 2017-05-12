const gameSetup = require('./setup');
const Player = gameSetup.Player;
let firstDeck = gameSetup.firstDeck;

module.exports = {
	startGame(Deck, Players) {
		Deck.shuffle();
		let pot = 0;
		pot = Players[0].smallBlind() + Players[1].bigBlind();
		for(let i = 0; i < 2; i++) {
			Players.forEach( player => {
				player.takeCard(Deck);
			})
		}
	}
}

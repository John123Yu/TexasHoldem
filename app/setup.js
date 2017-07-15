const suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
const values = {
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	'10':10,
	'j':10,
	'q':10,
	'k':10,
	'1': [11]
}

class Card {
	constructor(suit, number, value) {
		this.suit = suit;
		this.number = number;
		this.value = value;
	}
}

class Deck {
	constructor() {
		this.cards = [];
		this.buildDeck();
	}
	buildDeck() {
		suits.forEach( suit => {
			for(let number in values) {
				let newestCard = new Card(suit, number, values[number]);
				newestCard.img = imageGenerator(newestCard.suit, newestCard.number);
				this.cards.push(newestCard);
			}
		})
		return this;
	}
	shuffle() {
		let unshuffledEdge = this.cards.length,
		cardToShuffleIdx,
		temp;
		while(unshuffledEdge > 0) {
			cardToShuffleIdx = Math.floor(Math.random() * unshuffledEdge);
			unshuffledEdge--;
			temp = this.cards[cardToShuffleIdx];
		    this.cards[cardToShuffleIdx] = this.cards[unshuffledEdge];
		    this.cards[unshuffledEdge] = temp;
		}
		return this;
	}
	reset() {
		this.buildDeck().shuffle();
	}
	dealRandomCard() {
		return (this.cards.length > 0) ? this.cards.pop() : null;
	}
}

class Player {
	constructor(name, buyin) {
		this.name = name;
		this.hand = [];
		this.chipCount = buyin;
		this.position;
		this.folded = false;
	}
	takeCard(deck) {
		this.hand.push(deck.dealRandomCard());
		return this;
	}
	action(action, amount = 0) {
		if(action == 'raise' || action == 'call') {
			if(amount > this.chipCount) {
				amount = this.chipCount;
				this.chipCount = 0;
			} else {
				this.chipCount -= amount;
			}
			return amount;
		} else {
			return 0;
		}
	}
	bigBlind() {
		this.chipCount -= .2;
		return .2;
	}
	smallBlind() {
		this.chipCount -= .1;
		return .1	
	}
}

class Board{
	constructor() {
		this.board = [];
	}
	flop(deck) {
		for(var i = 0; i < 3; i++){
			this.board.push(deck.dealRandomCard());
		}
	}
	turnOrRiver(deck) {
		this.board.push(deck.dealRandomCard());
	}
}

function imageGenerator(suit, number) {
	if(suit == "Spades") {
		return `s${number}.png`;
	} else if (suit == "Hearts") {
		return `h${number}.png`;
	} else if (suit == "Diamonds") {
		return `d${number}.png`;
	} else {
		return `c${number}.png`;
	}
}

var firstDeck = new Deck();

module.exports = {
	firstDeck,
	Player,
	Board
}


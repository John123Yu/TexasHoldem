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
	'a': [1,11]
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
	constructor(name) {
		this.name = name;
		this.hand = [];
	}
	takeCard(deck) {
		this.hand.push(deck.dealRandomCard());
		return this;
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

console.log("hello");
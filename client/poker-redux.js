var redux = require('redux');

var defaultTableState = {
  card1: "./images/cards-png/b2fv.png",
  card2: "./images/cards-png/b2fv.png",
  user: "",
  burn1: "",
  burn2: "",
  burn3: "",
  flop1: "",
  flop2: "",
  flop3: "",
  turn: "",
  river: "",
  action: "waiting",
  officialAction: 'waiting',
  shouldHide: true,
  message: ""
};

var tableReducer = (state = defaultTableState, action) => {
	let newState = Object.assign({}, state);
	switch (action.type){
		case 'HANDLE_USER':
			newState.card1 = action.card1;
			newState.card2 = action.card2;
			return newState;
		default:
			return state;
	}
}

var tableStore = redux.createStore(tableReducer);

tableStore.subscribe( () => {
	var state = tableStore.getState();
	console.log("state-", state);
})

// var action = {
// 	type: 'HANDLE_USER',
// 	card1: `./images/cards-png/${user.hand[0].img}`,
// 	card2: `./images/cards-png/${user.hand[1].img}`
// }

// store.dispatch(action);

module.exports = { tableStore }


var redux = require('redux');
let playerCount = 0;

var defaultTableState = {
  card1: "./images/cards-png/b2fv.png",
  card2: "./images/cards-png/b2fv.png",
  user: undefined,
  burn1: undefined,
  burn2: undefined,
  burn3: undefined,
  flop1: undefined,
  flop2: undefined,
  flop3: undefined,
  turn: undefined,
  river: undefined,
  action: "waiting",
  officialAction: 'waiting',
  shouldShow: 0,
  message: undefined,
  players : []
};

var tableReducer = (state = defaultTableState, action) => {
	let newState = Object.assign({}, state);
	switch (action.type){
		case 'DEAL_CARDS':
			newState.card1 = action.card1;
			newState.card2 = action.card2;
			return newState;
		case 'SHOW_OPTIONS':
			newState.shouldShow = action.shouldShow;
			newState.message = action.message;
			return newState;
		case 'CHANGE_ACTION':
			newState.action = action.action;
			return newState;
		case 'OFFICIAL_ACTION':
			newState.officialAction = state.action;
			return newState;
		case 'ADD_PLAYER':
			newState.players.push({eval('action.player'): playerCount});
			playerCount++;
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


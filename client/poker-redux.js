var redux = require('redux');

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
  position0: true,
  position1: false,
  position2: false,
  position3: false,
  position4: false,
  position5: false,
  position6: false,
  position7: false,
  position8: false
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


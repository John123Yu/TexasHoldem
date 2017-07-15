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
  shouldShow: 1000,
  message: undefined,
  position: undefined,
  canCheck: false
};

var tableReducer = (state = defaultTableState, action) => {
	let newState = Object.assign({}, state);
	switch (action.type){
		case 'DEAL_CARDS':
			newState.card1 = action.card1;
			newState.card2 = action.card2;
			return newState;
		case 'SHOW_OPTIONS':
			newState.message = action.message;
			newState.canCheck = action.canCheck;
			return newState;
		case 'CHANGE_ACTION':
			newState.action = action.action;
			return newState;
		case 'OFFICIAL_ACTION':
			newState.officialAction = state.action;
			return newState;
		case 'ADD_PLAYER_POSITION':
			newState.position = action.position;
			return newState;
		case 'SHOULD_SHOW': 
			newState.shouldShow = action.nextPosition;
			return newState;
		case 'FLOP':
			newState.burn1 = action.burn1;
			newState.flop1 = action.flop1;
			newState.flop2 = action.flop2;
			newState.flop3 = action.flop3;
			return newState;
		case 'TURN':
			newState.burn2 = action.burn2;
			newState.turn = action.turn;
			return newState;
		case 'RIVER':
			newState.burn3 = action.burn3;
			newState.river = action.river;
			return newState;
		case 'RESET':
			newState.card1 = action.card1;
			newState.card2 = action.card2;
			newState.burn1 = action.burn1;
			newState.burn2 = action.burn2;
			newState.burn3 = action.burn3;
			newState.flop1 = action.flop1;
			newState.flop2 = action.flop2;
			newState.flop3 = action.flop3;
			newState.turn = action.turn;
			newState.river = action.river;
			newState.message = action.message;
			return newState;
		case 'FOLD':
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
	// console.log("state-", state);
})

module.exports = { tableStore }


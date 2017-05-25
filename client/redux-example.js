var redux = require('redux');

var reducer = (state = {name: 'Anonymous'}, action) => {


	return state;
}

var store = redux.createStore(reducer);

var currentState = store.getState();

console.log("currentState - ", currentState);
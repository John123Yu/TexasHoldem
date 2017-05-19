var redux = require('redux'),
    reactRedux = require('react-redux')

var initialState = {

};

function reducer(state, action){
  switch(action.type) {
  	case "ADD_PLAYER":
  	case "RESET_DECK":
    case "DEAL_CARDS":
    case "FOLD":
    case "CHECK":
    case "CALL":
    case "RAISE":
    case "SET_PLAYER":
    default:
      return state
  }
}

function mapStateToProps(state){
  console.log('mapStateToProps called, State is now ' , state)
  return {
  }
}

function mapDispatchToProps(dispatch){
  console.log('dispatch is now ' , dispatch)
  return {
  }
}

var store = redux.createStore(reducer, initialState);
var reduxConnection = reactRedux.connect(mapStateToProps, mapDispatchToProps)

module.exports = {
	store,
	reduxConnection
}

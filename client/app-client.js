import React, {Component} from 'react';
import ReactDOM from 'react-dom';
let user;
let position;
let blind = 0;
let out = false;


$(document).ready(function (){
const socket = io.connect();
// 0 is small
// 1 is big
var new_user = function() {
    var name = prompt("Please enter your name");
    // var buyin = prompt("Please enter your buy-in")
    socket.emit("page_load", {
        name,
        buyin: 20
    }); 
}
new_user();
socket.on('existing_user', data => {
    $('.error').html(data.error);
    new_user();
});
socket.on('initiate_player', data => {
    $('.error').html("")
    user = data.user;
    var messages = data.messages;
    var messages_thread = '';
    for(var i = 0; i < messages.length; i++) {
        messages_thread += "<p>" + messages[i].name + ": " + messages[i].message + "</p>";
    }
    $('#message_board').append(messages_thread);
});

$('#new_message').submit( () => {
    socket.emit('new_message', {
        user,
        message: $('#message').val()
    })
    return false;
});
socket.on('post_new_message', data => {
    console.log(user)
    $('#message_board').append("<p>" + data.user + ": " + data.new_message + "</p>");
});

$('#start_action').submit( function() {
    socket.emit('start_action', { user })
    $(this).hide();
    return false;
});

socket.on('one_round', data => {
    user = updateUser(data);
    console.log(user)
    console.log(data);
    Rendered.handleUser(user);
    if(data.board.board.length === 3){
	    Rendered.handleFlop(data.board.board);
    } else if(data.board.board.length ===4){
	    Rendered.handleTurn(data.board.board);
    } else if(data.board.board.length ===5){
	    Rendered.handleRiver(data.board.board);
    }

    var amount = 0;
    if(position === data.nextPosition){
        if(out === true){
            socket.emit('act', {
                action: 'pass',
            })
            return;
        }
        var action = prompt(`Highest bet is ${data.highestBet}. Pot size is ${data.pot}. check, call, fold, or raise?`)
        if(action === 'raise') {
            amount = prompt('how much?');
        } else if(action === 'call') {
            amount = data.highestBet - blind;
        }
        if(action === 'fold') {
            out = true;
            socket.emit('act', {
                action: 'out'
            })
        }
        socket.emit('act', {
            action,
            amount,
            user,
            position,
        })
    }
})

socket.on('end_game', data => {
    alert(data.message);
})

function updateUser(data) {
    let playerPosition = -1;
    for(let item of data.players) {
        playerPosition++;
        if(item.name === user.name) {
            user = item;
            position = playerPosition;
            if(position === 0) { blind = .1; }
            else if(position === 1){ blind = .2; }
            if(data.round > 1) { blind = 0; }
        }
    }
    return user;
}
})
// class Greeter extends Component{
	// constructor(props) {
	// 	super(props);
	//     this.state = {
	//       name: props.name
	//     };
	// }
// 	onButtonClick(e) {
// 		e.preventDefault();
// 		var name = this.refs.name.value;
// 		this.setState({
// 			name
// 		})
// 	}
// 	render() {
// 		var name = this.state.name;
// 		return (
// 			<div>
// 				<h1>Hello {name}!</h1>
				// <form onSubmit={this.onButtonClick.bind(this)}>
				// 	<input type="text" ref="name" />
				// 	<button>Set Name</button>
				// </form>
// 			</div>
// 		)
// 	}
// };

// Greeter.defaultProps = {
// 	name: 'React'
// }

class Table extends Component{
	constructor(props) {
		super(props);
	    this.state = {
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
		  river: ""
	    };
	}
	handleUser(user) {
		this.setState({
			card1: `./images/cards-png/${user.hand[0].img}`,
			card2: `./images/cards-png/${user.hand[1].img}`
		})
	}
	handleFlop(board){
		this.setState({
			burn1: "./images/cards-png/b2fv.png",
			flop1: `./images/cards-png/${board[0].img}`,
			flop2: `./images/cards-png/${board[1].img}`,
			flop3: `./images/cards-png/${board[2].img}`
		})
	}
	handleTurn(board){
		this.setState({
			burn2: "./images/cards-png/b2fv.png",
			turn: `./images/cards-png/${board[3].img}` 
		})
	}
	handleRiver(board){
		this.setState({
			burn3: "./images/cards-png/b2fv.png",
			river: `./images/cards-png/${board[4].img}` 
		})
	}
	render() {
		return (
			<div>
				<Hand card1={this.state.card1} card2={this.state.card2} />
				<Board burn1={this.state.burn1} burn2={this.state.burn2} burn3={this.state.burn3} flop1={this.state.flop1} flop2={this.state.flop2} flop3={this.state.flop3} turn={this.state.turn} river={this.state.river}/>
			</div>
		)
	}
}

class Hand extends Component{
	render() {
		var card1 = this.props.card1;
		var card2 = this.props.card2;
		return (
			<div>
				<img src={card1}/>
				<img src={card2}/>
			</div>
		)
	}
}

class Board extends Component {
	render() {
		var burn1 = this.props.burn1,
			burn2 = this.props.burn2,
			burn3 = this.props.burn3,
			flop1 = this.props.flop1,
			flop2 = this.props.flop2,
			flop3 = this.props.flop3,
			turn = this.props.turn,
			river = this.props.river
		console.log("HEYOOOO");
		console.log(burn1);
		return (
			<div>
				<div className="burned">
					<img src={burn1}/>
					<img src={burn2}/>
					<img src={burn3}/>
				</div>
				<div className="board">
					<img src={flop1}/>
					<img src={flop2}/>
					<img src={flop3}/>
					<img src={turn}/>
					<img src={river}/>
				</div>
			</div>
		)
	}
}

var Rendered = ReactDOM.render(
	<Table />,
	document.getElementById("app")
);

console.log(Rendered);

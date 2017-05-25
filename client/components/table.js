import React, {Component} from 'react';
import Board from './board';
import Hand from './hand';
import Options from './options';
import apple from '../app-client';
import { store } from '../poker-redux';

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
    store.store.dispatch({
		type: 'HANDLE_USER',
		card1: `./images/cards-png/${user.hand[0].img}`,
		card2: `./images/cards-png/${user.hand[1].img}`
	});

    if(data.board.board.length === 3){
	    Rendered.handleFlop(data.board.board);
    } else if(data.board.board.length ===4){
	    Rendered.handleTurn(data.board.board);
    } else if(data.board.board.length ===5){
	    Rendered.handleRiver(data.board.board);
    }
    if(position === data.nextPosition){
	    var amount = 0;
        var action;
        if(out === true){
            socket.emit('act', {
                action: 'pass',
            })
            return;
        }
        Rendered.setOptions(data);
        $('#optionForm').on('submit', function() {
            action = Rendered.returnAction();
            if(action === 'raise') {
                amount = prompt('how much?');
            } 
            if(action === 'call') {
                amount = data.highestBet - blind;
            } else if(action === 'raise') {
                amount -= blind;
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
                blind
            })
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
		  river: "",
		  action: "waiting",
		  officialAction: 'waiting',
		  shouldHide: true,
		  message: ""
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
	setOptions(data) {
		this.setState({
			shouldHide: false,
			message: `Highest bet is ${data.highestBet}. Pot size is ${Math.floor(data.pot * 100) / 100}.`
		})
	}
	action(e) {
		e.preventDefault();
		this.setState({
			officialAction: this.state.action
		})
	}
	actionChange(e) {
		this.setState({
			action: e.target.value
		})
	}
	returnAction() {
		var action = this.state.officialAction;
		if(action != 'waiting'){
			this.setState({
				officialAction: 'waiting',
				shouldHide: true
			})
		}
		return action
	}
	render() {
		return (
			<div>
				<h1>Table</h1>
				<Hand card1={this.state.card1} card2={this.state.card2} />
				<Board burn1={this.state.burn1} burn2={this.state.burn2} burn3={this.state.burn3} flop1={this.state.flop1} flop2={this.state.flop2} flop3={this.state.flop3} turn={this.state.turn} river={this.state.river}/>
				<Options message={this.state.message} shouldHide={this.state.shouldHide} action={this.action.bind(this)} change={this.actionChange.bind(this)}/>
			</div>
		)
	}
}

module.exports = { Table }


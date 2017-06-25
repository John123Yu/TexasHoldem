import { tableStore } from './poker-redux';
import Cookies from 'universal-cookie';
import { hashHistory } from 'react-router';
const cookies = new Cookies();

let user;
let position;
let investment;
let out = false;
let cookie_user = cookies.get('user');
let amount;
let action;
let highestBet;
let initializeBlinds = true;

const socket = io.connect();
// 0 is small
// 1 is big
var new_user = function(user) {
    var name = `${user.first_name} ${user.last_name}`;
    socket.emit("page_load", {
        name,
        buyin: 20
    });
}

if(cookie_user) {
    console.log(cookie_user);
    new_user(cookie_user);
    hashHistory.push('/');
}

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
    // console.log(user)
    $('#message_board').append("<p>" + data.user + ": " + data.new_message + "</p>");
});

$('#start_action').submit( function() {
    socket.emit('start_action', { user })
    $(this).hide();
    return false;
});


socket.on('one_round', data => {
    if(data.newRound)
      investment = 0;
    user = updateUser(data);
    // console.log(user)
    // console.log("DATA ", data);
    highestBet = data.highestBet;

    tableStore.dispatch({
        type: 'SHOULD_SHOW',
        nextPosition: data.nextPosition
    })
    if(data.round === 1) {
        tableStore.dispatch({
    		type: 'DEAL_CARDS',
    		card1: `./images/cards-png/${user.hand[0].img}`,
    		card2: `./images/cards-png/${user.hand[1].img}`
    	});
    }
    if(data.board.board.length === 3){
	    tableStore.dispatch({
	    	type: "FLOP",
            flop1: "./images/cards-png/" + data.board.board[0].img,
            flop2: "./images/cards-png/" + data.board.board[1].img,
            flop3: "./images/cards-png/" + data.board.board[2].img,
            burn1: "./images/cards-png/b2fv.png"
        })
    } else if(data.board.board.length === 4){
	    tableStore.dispatch({
            type: "TURN",
            turn: "./images/cards-png/" + data.board.board[3].img,
            burn2: "./images/cards-png/b2fv.png"
        })
    } else if(data.board.board.length === 5){
	    tableStore.dispatch({
            type: "RIVER",
            river: "./images/cards-png/" + data.board.board[4].img,
            burn3: "./images/cards-png/b2fv.png"
        })
    }
    if(position === data.nextPosition){
        var action;
        if(out === true){
            socket.emit('act', {
                action: 'pass',
            })
            return;
        }
        let canCheck = (data.highestBet - investment === 0)
        tableStore.dispatch({
        	type: "SHOW_OPTIONS",
        	message: `${data.highestBet - investment} to call. Pot size is ${Math.floor(data.pot * 100) / 100}. You've put in ${investment} this round.`,
            canCheck
        })
    }

})

var decision = function(action) {
    amount = 0;
    let tempInvestment = investment;
    if(action != 'waiting'){
    }
    if(action === 'raise') {
        amount = prompt('how much?');
        investment = amount;
    } 
    if(action === 'raise') {
        amount -= tempInvestment;
    } else if(action === 'call') {
        amount = highestBet - tempInvestment;
        investment = highestBet;
    } else if(action === 'fold') {
        out = true;
        socket.emit('act', {
            action: 'fold'
        })
    } else if(action === 'check') {

    }
    // console.log('amount', amount, " action ", action, " user ", user, " position ", position, " investment ", investment);
    socket.emit('act', { action, amount, user, position, investment })
}       

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
            if(initializeBlinds){
                if(position === 0) { investment = .1; }
                else if(position === 1){ investment = .2; }
                initializeBlinds = false;
            }
        }
    }
    tableStore.dispatch({
        type: 'ADD_PLAYER_POSITION',
        position,
    })
    return user;
}

module.exports = {
    new_user,
    decision
}
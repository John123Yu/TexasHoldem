import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Table, actionMethod } from './components/table';


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
    if(position === data.nextPosition){
	    var amount = 0;
        var action;
        if(out === true){
            socket.emit('act', {
                action: 'pass',
            })
            return;
        }
        var startAction = new Promise((resolve, reject) => {
            Rendered.setOptions(data);
            (function myLoop (i) {          
               setTimeout( () => {   
                  action = Rendered.returnAction();
                  if(action != 'waiting'){
                    resolve();
                  }          
                  if(--i) { myLoop(i); } else {
                    reject();
                  }
               }, 1000)
            })(10); 
        }).then( () => {
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
        }).catch( () => {
            out = true;
            socket.emit('act', {
                action: 'out'
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

var Rendered = ReactDOM.render(
    <Table />,
    document.getElementById("app")
);


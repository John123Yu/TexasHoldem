import { tableStore } from './poker-redux';

let user;
let position;
let blind = 0;
let out = false;

const socket = io.connect();
// 0 is small
// 1 is big
var new_user = function(user) {
    var name = `${user.first_name} ${user.last_name}`;
    socket.emit("page_load", {
        name,
        buyin: 20
    });
    tableStore.dispatch({
        type: 'ADD_PLAYER',
        player: `${user.first_name} ${user.last_name}`,
    })
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
    // console.log(user)
    // console.log(data);
    tableStore.dispatch({
		type: 'DEAL_CARDS',
		card1: `./images/cards-png/${user.hand[0].img}`,
		card2: `./images/cards-png/${user.hand[1].img}`
	});
    if(data.board.board.length === 3){
	    console.log(data.board.board)
	    tableStore.dispatch({
	    	type: "FLOP"
	    })
    } else if(data.board.board.length === 4){
	    // Rendered.handleTurn(data.board.board);
    } else if(data.board.board.length === 5){
	    // Rendered.handleRiver(data.board.board);
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
        tableStore.dispatch({
        	type: "SHOW_OPTIONS",
        	shouldShow: position,
        	message: `Highest bet is ${data.highestBet}. Pot size is ${Math.floor(data.pot * 100) / 100}.`
        })
        $('#optionForm').on('submit', function() {
        	action = tableStore.getState().officialAction;
        	if(action != 'waiting'){
        		// tableStore.dispatch({
        		// 	action: "RESET_ACTION",
        		// 	officialAction: 'waiting'
        		// })
			}
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

module.exports = {
    new_user
}
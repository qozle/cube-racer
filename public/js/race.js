$(function(){
	var socket = io.connect('https://localhost:1337');

//  C H A T  S T U F F !
	$('#chat-form').submit(function(e){
		e.preventDefault();
		socket.emit('newMessage', $('#chat-input-field').val());
		
		$('#chat-input-field').val('');
		return false;
	});
	
	socket.on('newMessage', (message)=>{
		$('#messages').append($('<li>').text(message));
	});
	
	
});
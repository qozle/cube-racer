	

$(function(){
	
	var socket = io.connect('https://localhost:1337');
	var handle = localStorage.getItem('handle');
	console.log(handle);
	//  S T O P W A T C H 
	
	
	
//	$('#nav-stats').attr('href', `/users/${handle}`);
	

	
	
	
	
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
	
	
	
	//   L O G  O U T 
	$('.logout').click(function(e){
		e.preventDefault();
		$.ajax({
			url :'/logout',
			type: 'GET',
			success: function(data){
				$('body').empty();
				$('body').prepend(data);
				localStorage.removeItem('handle');
				socket.close();
				$(window).off('click');
			}
		});
	});
	
	

	
	
	

	
});







//
//
//
//
//var interval = 1000; // ms
//var expected = Date.now() + interval;
//setTimeout(step, interval);
//function step() {
//    var dt = Date.now() - expected; // the drift (positive for overshooting)
//    if (dt > interval) {
//        // something really bad happened. Maybe the browser (tab) was inactive?
//        // possibly special handling to avoid futile "catch up" run
//    }
//    … // do what is to be done
//
//    expected += interval;
//    setTimeout(step, Math.max(0, interval - dt)); // take into account drift
//}
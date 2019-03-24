//  Expose socket globally.  Bad idea...?
var socket = io();


$(function(){
	var userProfile = window.location.pathname;
	socket.emit('reqPlayerInfo', {userProfile: userProfile});
	
	//  If there isn't a user with this handle name
	socket.on('noProfile', function(){
		$('body').append('<p>').text("Sorry, looks like there's no user with that handle =(");
	});
	
	//  Serve player profile data if there is
	socket.on('playerProfileData', function(data){
		console.log(data);
		var name = data.firstname + ' ' + data.lastname;
		var birthday = data.bday + '/' + data.bmonth + '/' + data.byear;
		$('#player-heading').text(data.handle);
		$('#username').text(data.handle);
		$('#name').text(name);
		$('#birthday').text(birthday);
		
	});
	
	
});
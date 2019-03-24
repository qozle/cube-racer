

$(function(){
	var userProfile = window.location.pathname;
	//  This has to be changed to an ajax GET request
	$.ajax({
		url: '/getProfile',
		type: 'POST',
		data: {profile: userProfile},
		success: function(data){
		//  If there's actually data, this will populate
		//  the page with it.
			if (typeof data == 'string'){
				$('body').empty();
				$('body').append(data);
			}
			var name = data.firstname + ' ' + data.lastname;
			var birthday = data.bday + '/' + data.bmonth + '/' + data.byear;
			$('#player-heading').text(data.handle);
			$('#username').text(data.handle);
			$('#name').text(name);
			$('#birthday').text(birthday);
		},
		error: function(error){
			$('body').empty();
			$('body').append(error);
		}
	});
	

	
	

	
	
});


$(function(){
	var userProfile = window.location.pathname;
	//  Get user profile information
	$.ajax({
		url: '/getProfile',
		type: 'POST',
		data: {profile: userProfile},
		success: function(data){
		//  If there's actually data, this will populate
		//  the page with it.
			console.log(data);
			var profileData = data[0];
			var recentTimes = data[1];
			
			var name = profileData.firstname + ' ' + profileData.lastname;
			var birthday = profileData.bday + '/' + profileData.bmonth + '/' + profileData.byear;
			$('#player-heading').text(profileData.handle);
			$('#username').text(profileData.handle);
			$('#name').text(name);
			$('#birthday').text(birthday);
			
			recentTimes.forEach(function(time, index){
				console.log(JSON.stringify(time));
				$('#times-table').append($(`<tr id='tr${index}'>`));
				$(`#tr${index}`).append($('<td>').text(time.cube));
				$(`#tr${index}`).append($('<td>').text(time.date));
				var concatTime = `${time.min}:${time.sec}.${time.ms}`;
				$(`#tr${index}`).append($('<td>').text(concatTime));
				
			});
		},
		error: function(error){
			$('body').empty();
			$('body').append(error);
		}
	});

	

	
	

	
	
});
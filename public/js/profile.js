$(function(){
	var userProfile = localStorage.getItem('handle');
	//  Get user profile information
	$.ajax({
		url: '/getProfile',
		type: 'POST',
		data: {profile: userProfile},
		success: function(data){
		//  If there's actually data, this will populate
		//  the page with it.
			var profileData = data[0];
			var recentTimes = data[1];
			
			var name = profileData.firstname + ' ' + profileData.lastname;
			var birthday = profileData.bday + '/' + profileData.bmonth + '/' + profileData.byear;
			$('#player-heading').text(profileData.handle);
			$('#username').text(profileData.handle);
			$('#name').text(name);
			$('#birthday').text(birthday);
			
			recentTimes.forEach(function(time, index){
				$('#times-table').append($(`<tr class='score-row' id='tr${index}'>`));
				$(`#tr${index}`).append($('<td>').text(time.cube));
				$(`#tr${index}`).append($('<td>').text(time.date));
				var concatTime = `${time.min}:${time.sec}.${time.ms}`;
				$(`#tr${index}`).append($('<td>').text(concatTime));
				
			});
			
			$('.score-row').slice(0,10).show();
			if ($('.score-row:hidden').length != 0){
				$('#load-more').show();
			}
		},
		error: function(error){
			console.log(error)
		}
	});
	

	$('#load-more').click(function(e){
		if ($('.score-row:hidden').length != 0){
			e.preventDefault();
			$('.score-row:hidden').slice(0, 10)
				.css('opacity', 0)
				.slideDown(500)
				.animate(
				{ opacity: 1 },
				{ queue: false, duration: 500 });
			
			
		} else {
			$('#load-more').fadeOut('slow');
		}
	});
	});

	
	


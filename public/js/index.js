
$(function(){
	
	$('#login_signupLink').click((e)=>{
		console.log('pressed')
		e.preventDefault();
		$.ajax({
			url: '/login-signup',
			type: 'GET',
			success: (data)=>{
				$('#main-container').empty();
				$('#main-container').append(data);
			}
		});
	});
	
	
});
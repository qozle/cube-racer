
$(function(){
	
	$('#login_signupLink').click((e)=>{
		console.log('pressed')
		e.preventDefault();
		$.ajax({
			url: '/login-signup',
			type: 'GET',
			success: (data)=>{
				$('#main-content').remove();
				$('#main-container').append(data);
			}
		});
	});
	
	
});
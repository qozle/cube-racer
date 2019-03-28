$(function(){
	
	var names = [];
	
	$.ajax({
		url: '/getUserList',
		type: 'GET', 
		success: (data)=>{
			console.log(data);
			data.forEach(function(element, index){
				names.push(element.handle);
			});
		}
	});
	
	autocomplete(document.getElementById('myInput'), names);
	
	//  timer view
	$('#nav-timer').click(function(e){
		e.preventDefault();
		$('#navbarNav').collapse('toggle');
		$.ajax({
			url : '/timer',
			type : 'GET',
			success: function(data){
				$('#main-content').remove();
				$('#main-container').append(data);
			}
		});

	});

	//  profile view
	$('#nav-stats').click(function(e){
		e.preventDefault();
		$.ajax({
			url: `/users/${localStorage.getItem('handle')}`,
			type: 'GET',
			success: function(data){
				//  this lags, should use promises >_<
				$('#main-content').remove();
				$('#main-container').append(data);
//				$('#navbarNav').collapse('toggle');
			}, 
			error: function(error){
				console.log(error.message);
			}
		});
	});

});
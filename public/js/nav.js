$(function(){
	var userToGet;
	var names = [];
	
	//  Collapse the navbar if the mouse clicks off of it,
	//  but only if certain nav elements aren't being selected
	$(window).click(function(e){
			if (!$(e.target).is('nav') &&  !$(e.target).is('#myInput') && !$(e.target).is('.acLink')){
				$('#navbarNav').collapse('hide');
			}
		});
	
	
	$.ajax({
		url: '/getUserList',
		type: 'GET', 
		success: (data)=>{
			data.forEach(function(element, index){
				names.push(element.handle);
			});
		}
	});
	
	autocomplete(document.getElementById('myInput'), names);
	
	//  home view
//	$('.navbar-brand').click((e)=>{
//		e.preventDefault();
//		$.ajax({
//			url : '/homePage',
//			type: 'GET',
//			success: (data)=>{
//				$('body').remove();
//				$('html').append('<body>').html(data);
//			}
//		});
//	});
	
	
	//  timer view
	$('#nav-timer').click(function(e){
		e.preventDefault();
		$.ajax({
			url : '/timer',
			type : 'GET',
			success: function(data){
				$('#main-container').empty();
				$('#main-container').append(data);
			}
		});

	});
	
	
	//  race view
//	$('#nav-race').click((e)=>{
//		e.preventDefault();
//		$.ajax({
//			url: '/race',
//			type: 'GET',
//			success: (data)=>{
//				$('#main-content').remove();
//				$('#main-container').append(data);
//			}
//		});
//	});
//	
	
	//  profile view
	$('#nav-profile').click(function(e){
		e.preventDefault();
		window.history.replaceState(null, null, `?user=${window.localStorage.getItem('handle')}`)
		$.ajax({
			url: '/getProfile',
			type: 'GET',
			success: function(data){
				//  this looks wonky when executed, should use .then / promisey stuff???
				$('#main-container').empty();
				$('#main-container').append(data);
				//$('#navbarNav').collapse('toggle');
			}, 
			error: function(error){
				console.log(error.message);
			}
		});
	});
	
	
	//  
	$('#nav-search-button').click((e)=>{
		e.preventDefault();
		if ($('#myInput').val() != ''){
			window.history.replaceState(null, null,`?user=${$('#myInput').val()}`);
			$.ajax({
				url: '/getProfile',
				type: 'GET',
				success: (data) =>{
					$('#main-container').empty();
					$('#main-container').append(data);
					$('#myInput').val('');
				}
			});
		}
	});
	
	
});


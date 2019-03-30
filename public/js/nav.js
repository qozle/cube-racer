$(function(){
	
	var names = [];
	
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
				$('#main-content').remove();
				$('#main-container').append(data);
			}
		});

	});
	
	
	//  race view
	$('#nav-race').click((e)=>{
		e.preventDefault();
		$.ajax({
			url: '/race',
			type: 'GET',
			success: (data)=>{
				$('#main-content').remove();
				$('#main-container').append(data);
			}
		});
	});
	
	

	//  profile view
	$('#nav-profile').click(function(e){
		e.preventDefault();
		$.ajax({
			url: `/users/${localStorage.getItem('handle')}`,
			type: 'GET',
			success: function(data){
				//  this looks wonky when executed, should use .then / promisey stuff???
				$('#main-content').remove();
				$('#main-container').append(data);
//				$('#navbarNav').collapse('toggle');
			}, 
			error: function(error){
				console.log(error.message);
			}
		});
	});
	
	$('.logout').click(function(e){
		e.preventDefault();
		$.ajax({
			url :'/logout',
			type: 'GET',
			success: function(data){
				$('body').empty();
				$('body').append(data);
				localStorage.removeItem('handle');
				socket.close();
				$(window).off('click');
			}
		});
	});

});
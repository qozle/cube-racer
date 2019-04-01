	

$(function(){
	var handle = localStorage.getItem('handle');
	var socket = io.connect('https://localhost:1337');
	var intervals = [];
//	$('#main-content').css('margin', '0');

//  C H A T  S T U F F !
	
	//  Get a list of all the current (eventually public) rooms
	var rooms = []
	socket.emit('get rooms');
	socket.on('get rooms', (data)=>{
		for (room in data.rooms){
			console.log(room)
			rooms.push(room)
		}
		rooms.splice(0,1);
	});
	
	
	
	
	$('#chat-form').submit(function(e){
		e.preventDefault();
		socket.emit('newMessage', {
			msg: $('#chat-input-field').val(),
			handle: handle,
			room: $('ul.active').attr('id')
		});
		
		$('#chat-input-field').val('');
		return false;
	});
	
	//  Init with general, so make sure it's auto scrolling 
	//  to the bottom
	intervals.forEach((interval, index)=>{
		clearInterval(interval);
	});
	intervals = [];
	intervals.push(setInterval(scrollWatcher, 100, $('.messageBox.active')));
	
	$('#tabGeneral').click((e)=>{
		$('#messages-container').children().removeClass('active');
		$('#messages-container').children().addClass('hidden');
		$('#general').addClass('active')
		$(e.target).siblings().removeClass('active-tab');
		$(e.target).addClass('active-tab');
		intervals.forEach((interval, index)=>{
		clearInterval(interval);
		});
		intervals = [];
		intervals.push(setInterval(scrollWatcher, 100, $('.messageBox.active')));
	});
	
	socket.on('newMessage', (msgData)=>{
		$(`#${msgData.room}`).append($('<li>').text(msgData.handle + ": " + msgData.msg));
	});
	
	
	$('#make-room-btn').click((ee)=>{
		ee.preventDefault();
		//  connect user to the new room
		//  add a tab for the new room
		//  add a window for the new room
		//  set click event listener on tab to show new room
		$('#tab-container').children().removeClass('active-tab');
		$('#tab-container').append($('<button>').attr({class: 'tab-button active-tab', id: 'tab' + $('#make-room-name').val()}).text($('#make-room-name').val()));
		$('#messages-container').children().removeClass('active');
		$('#messages-container').children().addClass('hidden');
		$('#messages-container').append($('<ul>').attr({class: 'messageBox active', id: $('#make-room-name').val()}));
		intervals.forEach((interval, index)=>{
			clearInterval(interval);
		});
		intervals = []
		intervals.push(setInterval(scrollWatcher, 100, $('.messageBox.active')));
		
		//  How bout this beauty, yikes
		$(`#tab${$('#make-room-name').val()}`).click({el: $(`#${$('#make-room-name').val()}`)}, (e)=>{
			$('#messages-container').children().removeClass('active');
			$('#messages-container').children().addClass('hidden');
			e.data.el.addClass('active');
			$('#tab-container').children().removeClass('active-tab');
			$(e.target).addClass('active-tab');
		});
		socket.emit('make new room', {handle: handle, roomName: $('#make-room-name').val()});
		$('#make-room-name').val('');
		$('#make-room-div').toggle('collapse');
	});
	
	
	$('#join-room-btn').click((e)=>{
		e.preventDefault();
		$('#tab-container').append($('<button>').attr({class: 'tab-button', id: 'tab' + $('#join-room-name').val()}).text($('#join-room-name').val()));
		$('#messages-container').children().removeClass('active');
		$('#messages-container').children().addClass('hidden');
		$('#messages-container').append($('<ul>').attr({class: 'messageBox active', id: $('#join-room-name').val()}));
		intervals.forEach((interval, index)=>{
			clearInterval(interval);
		});
		intervals = []
		intervals.push(setInterval(scrollWatcher, 100, $('.messageBox.active')));
		
		//  How bout this beauty, yikes
		$(`#tab${$('#join-room-name').val()}`).click({el: $(`#${$('#join-room-name').val()}`)}, (e)=>{
			$('#messages-container').children().removeClass('active');
			$('#messages-container').children().addClass('hidden');
			e.data.el.addClass('active');
			$(e.target).siblings().removeClass('active-tab');
			$(e.target).addClass('active-tab');
		});
		socket.emit('join new room', {handle: handle, roomName: $('#join-room-name').val()});
		$('#join-room-name').val('');
		$('#join-room-div').toggle('collapse');		
	});
	

	
	$('#leave-room-btn').click((e)=>{
		e.preventDefault();
		var room = $('ul.active').attr('id');
		socket.emit('leave room', {room: room});
		$('ul.active').remove();
		$('.messageBox').eq(0).addClass('active');
		$('button.active-tab').remove();
		$('button.tab-button').eq(0).addClass('active-tab');
		intervals.forEach((interval, index)=>{
				clearInterval(interval);
			});
		intervals = []
		intervals.push(setInterval(scrollWatcher, 100, $('.messageBox.active')));
		
	});
	
	
	
    function scrollWatcher(doc) {
        // allow 1px inaccuracy by adding 1
        var isScrolledToBottom = doc.prop('scrollHeight') - doc.prop('clientHeight') <= doc.prop('scrollTop') + 25
        // scroll to bottom if isScrolledToBottom is true
        if (isScrolledToBottom) {
          doc.prop('scrollTop', doc.prop('scrollHeight')  -doc.prop('clientHeight'))
        }
    }
	
	
	
	


	
	
	

	
});

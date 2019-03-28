$(function(){
	
	//  S T O P  W A T C H 
	//  This feels messy but eh it works
	var timerData = {
		start: false,
		displayTimer: '',
		lastTime: new Date(),
		times: []
	}
	//  Call the stopwatch on spacebar key up.
	$(document).keyup(function(e){
		if (e.which == 32) {
			if (!$('#chat-input-field').is(':focus') &&
			   !$('#logout-button').is(':focus') &&
			   !$('#collapse-button').is(':focus')){
				timerData = stopWatch(timerData);
			}
			
		}
		
	});



});


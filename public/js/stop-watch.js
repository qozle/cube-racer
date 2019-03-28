//  Ok this isn't too bad, it's still modular and takes a callback
function stopWatch(timerData, callback) {
	var start = timerData.start;
	var times = timerData.times;
	var displayTimer = timerData.displayTimer;
	var lastTime = timerData.lastTime;
	
	if (!start){
		start = true;
		console.log('starting timer');
		var startTime = new Date();
		displayTimer = setInterval(displayTime, 1, startTime);
		var newTimerData = {start: start, displayTimer:displayTimer, lastTime:lastTime, times: times};
		return newTimerData;
	} else if (start) {
		//  Stop the timer, pass the current values to the callback
		console.log('stopping timer');
		clearInterval(displayTimer);
		start = false;
		var newTimerData = callback(start, displayTimer, lastTime, times);
		return newTimerData;
	}
	
	function displayTime(startTime){
		lastTime = new Date(new Date() - startTime);
		newTimerData.lastTime = lastTime;
		$('#timer-text span:nth-child(1)').text(('0' + lastTime.getMinutes()).slice(-2) + ':'); 
		$('#timer-text span:nth-child(2)').text(('0' + lastTime.getSeconds()).slice(-2) + '.');
		$('#timer-text span:nth-child(3)').text(('00' + lastTime.getMilliseconds()).slice(-3));
	}
}


	

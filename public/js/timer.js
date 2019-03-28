$(function(){
	//  Collapse the chat container, because you
	//  came here to solve, obv.
	$('#chat-container').toggle('collapse');
	
	//////////////////////////////////////////
	//  S T O P  W A T C H 
	/////////////////////////////////////////
	
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
				timerData = stopWatch(timerData, useTimerData);
			}
		}
	});
	//  This is the callback from stopWatch.js.  It gets called
	//  every time the stopwatch is stopped, and returns data 
	//  about the last solve et misc: 
	//		start = stopwatched started or not, boolean
	//  	displayTimer = setInterval id which gets passed back //		 to stop the timer.
	//      lastTime = Date() containing time duration of last solve, bit wonky I guess
	//		times = array of all the times from this session
	function useTimerData(start, displayTimer, lastTime, times) {
		
		//  Send times over to the server to put into the database
		$.ajax({
			url: '/newTime',
			type: 'POST', 
			data: {
				mins: lastTime.getMinutes(),
				secs: lastTime.getSeconds(),
				ms: lastTime.getMilliseconds()
			},
			success: (data) => {
			},
			error: (error) => {
				console.log(error);
			}
		});
		
		//  add time to the list of times
		$('#times-list').prepend('<li class="list-group-item list-group-item-action">' + ('0' + lastTime.getMinutes()).slice(-2) + ':' + ('0' + lastTime.getSeconds()).slice(-2) + '.' + ('00' + lastTime.getMilliseconds()).slice(-3) + '</li>');
		times.push(lastTime);

		//  Input into HTML table
		//  B E S T  T I M E
		var newBestTime = bestTime(times);
		$('#best').text(('0' + newBestTime.getMinutes()).slice(-2) + ':' + ('0' + newBestTime.getSeconds()).slice(-2) + ':' + ('00' + newBestTime.getMilliseconds()).slice(-3));
		
		//  A V E R A G E  T I M E 
		var newAverageTime = averageTime(times);
		$('#average').text(('0' + newAverageTime.getMinutes()).slice(-2) + ':' + ('0' + newAverageTime.getSeconds()).slice(-2) + ':' + ('00' + newAverageTime.getMilliseconds()).slice(-3));
		
		//  A V E R A G E  O F  F I V E
		if (times.length >= 5){
			var newAverageOfFive = averageOfFive(times);
			$('#average-of-5').text(('0' + newAverageOfFive.getMinutes()).slice(-2) + ':' + ('0' + newAverageOfFive.getSeconds()).slice(-2) + ':' + ('00' + newAverageOfFive.getMilliseconds()).slice(-3));
		}
		
		//  T H R E E  O F  F I V E
		if (times.length >= 5){
			var newThreeOfFive =  threeOfFive(times);
			$('#3-of-5').text(('0' + newThreeOfFive.getMinutes()).slice(-2) + ':' + ('0' + newThreeOfFive.getSeconds()).slice(-2) + ':' + ('00' + newThreeOfFive.getMilliseconds()).slice(-3));				
		}
		
		//  A V E R A G E  O F  T E N
		if (times.length >= 10){
			var newAverageOfTen = averageOfTen(times);
			$('#average-of-10').text(('0' + newAverageOfTen.getMinutes()).slice(-2) + ':' + ('0' + newAverageOfTen.getSeconds()).slice(-2) + ':' + ('00' + newAverageOfTen.getMilliseconds()).slice(-3));
		}
		
		//  E I G H T  O F  T E N 
		if (times.length >= 10){
			var newEightOfTen = eightOfTen(times);
			$('#8-of-10').text(('0' + newEightOfTen.getMinutes()).slice(-2) + ':' + ('0' + newEightOfTen.getSeconds()).slice(-2) + ':' + ('00' + newEightOfTen.getMilliseconds()).slice(-3));				
		}
		
		var newTimerData = {start:start, displayTimer: displayTimer, lastTime:lastTime, times:times};
		return newTimerData;
	}
	
	
	///////////////////////////////////////////
	//// S R C M A B L E R
	//////////////////////////////////////////
	const possibleTurns = ["U","D","L","R","F","B","U'","D'","L'","R'","F'","B'"];
	
	//  Don't mind me, just building my own random choice function...
	function choose(array){
		var index = Math.floor(Math.random() * array.length);
		return array[index];
	}
	
	var scramble = {set0: [], set1: [], set2: [], set3: [], set4:[]};
	
	for (var i = 0; i <=4; i++){
		for (var j = 0; j <=3; j++){
			scramble['set' + i].push(choose(possibleTurns));
		}
	}
	//  Works, just needs to be reformatted to display pretty-like
	$('#scramble').text(
		scramble.set0 + '-' + 
		scramble.set1 + '-' +
		scramble.set2 + '-' +
		scramble.set3 + '-' +
		scramble.set4
	);
	
	
	



});


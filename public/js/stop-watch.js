//  all this should be wrapped in a function so these don't
//  get exposed globally



//  This belongs in whatever file is actually calling
//  the function, just here for reference now



//  Ths is the main wrapper so all the other functions
//  should go here?

//class StopWatch {
//	constructor(startTime){
//	}
//	
//	get time() {
//		return this.latestTime;
//	}
//
//	
//	startTimer(){
//		var startTime = new Date();
//		this.timer = setInterval(this.addTimeIncrement, 1000, startTime);
//    }
//	
//	addTimeIncrement(startTime){
//		get latestTime(){
//			return new Date(new Date() - startTime);	
//		} 
//		console.log(this.latestTime);
//		
//    }
//
//	stopTimer(){
//		clearInterval(this.timer)
//    }
//}

function stopWatch(timerData) {
	
	
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
		//  Stop the timer, push the last time 
		//  to the list of times, emit the data to the server, update the stats chart
		console.log('stopping timer');
		clearInterval(displayTimer);
		start = false;
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
				console.log()
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




function displayTime(startTime){
	lastTime = new Date(new Date() - startTime);
	newTimerData.lastTime = lastTime;
	$('#timer-text span:nth-child(1)').text(('0' + lastTime.getMinutes()).slice(-2) + ':'); 
	$('#timer-text span:nth-child(2)').text(('0' + lastTime.getSeconds()).slice(-2) + '.');
	$('#timer-text span:nth-child(3)').text(('00' + lastTime.getMilliseconds()).slice(-3));
}



//  B E S T  T I M E
function bestTime(listOfTimes){
	var bestTime = new Date();
	listOfTimes.forEach(function(time){
		if (time.getTime() < bestTime.getTime()){
			bestTime = time;
		}
	});
	return new Date(bestTime);
}


//  A V E R A G E  T I M E 
function averageTime(listOfTimes){
	var timeInMs = 0;
	listOfTimes.forEach(function(time){
		timeInMs += time.getTime();
	});
	timeInMs /= listOfTimes.length;
	return new Date(timeInMs);
}


//  A V E R A G E  O F  5 
function averageOfFive(listOftimes){
	var lastFiveTimes = [];
	var average = 0;
	//  This works fine, but just make sure that it pulls the
	//  new values from the END of the array, or else you won't
	//  get any of the new results. 
	for(var i = times.length; i > times.length - 5; i--){
		lastFiveTimes.push(times[i - 1]);
	}
	lastFiveTimes.forEach(function(time){
		average += time.getTime();
	});
	average /= 5;
	console.log(average);
	return new Date(average);
}

//  T H R E E  O F  F I V E
function threeOfFive(listOfTimes){
	var lastFiveTimes = [];
	var average = 0;
	//  Kind of sloppy- get the last five times,
	//  turn them into ms so they can be sorted,
	//  remove the first and last (highest and lowest)
	//  add them all to the average sum, turn them back
	//  into dates, and then return the average.  
	for (var i = times.length; i > times.length -5; i--){
		lastFiveTimes.push(times[i-1].getTime());
	}
	lastFiveTimes.sort();
	lastFiveTimes.splice(4,1);
	lastFiveTimes.splice(0,1);
	lastFiveTimes.forEach(function(time, index){
		average += time;
		time = new Date(time);
	});
	average /= 3;
	return new Date(average);
	}


//  A V E R A G E  O F  10 
function averageOfTen(listOftimes){
	var lastTenTimes = [];
	var average = 0;
	//  This works fine, but just make sure that it pulls the
	//  new values from the END of the array, or else you won't
	//  get any of the new results. 
	for(var i = times.length; i > times.length - 10; i--){
		lastTenTimes.push(times[i - 1]);
	}
	lastTenTimes.forEach(function(time){
		average += time.getTime();
	});
	average /= 10;
	console.log(average);
	return new Date(average);
}


	//  E I G H T  O F  T E N
function eightOfTen(listOfTimes){
	var lastTenTimes = [];
	var average = 0;
	//  Kind of sloppy- get the last five times,
	//  turn them into ms so they can be sorted,
	//  remove the first and last (highest and lowest)
	//  add them all to the average sum, turn them back
	//  into dates, and then return the average.  
	for (var i = times.length; i > times.length - 10; i--){
		lastTenTimes.push(times[i - 1].getTime());
	}
	lastTenTimes.sort();
	lastTenTimes.splice(9,1);
	lastTenTimes.splice(0,1);
	lastTenTimes.forEach(function(time, index){
		average += time;
		time = new Date(time);
	});
	average /= 8;
	return new Date(average);
}
}


	

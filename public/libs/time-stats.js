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
$(function(){
	
	//  S T O P W A T C H 
	var start = false;
	var displayTimer;
	var lastTime;
	var times = [];
	$(window).keyup(function(e){
		if (e.keyCode == 32) {
			e.preventDefault();
			stopWatch(e);
		}
	});
		
	function stopWatch(e){
		if (!start){
			start = true;
			console.log('starting timer');
			var startTime = new Date();
			displayTimer = setInterval(displayTime, 45, startTime);
		} else if (start) {
			//  Stop the timer, push the last time 
			//  to the list of times, emit the data to the server, update the stats chart
			console.log('stopping timer');
			clearInterval(displayTimer);
			
			$('#times-list').prepend('<li>' + lastTime.getMinutes() + ':' + lastTime.getSeconds() + ':' + lastTime.getMilliseconds() + '</li>');
			times.push(lastTime);
			//  B E S T  T I M E
			var newBestTime = bestTime(times);
			$('#best').text(newBestTime.getMinutes() + ':' + newBestTime.getSeconds() + ':' + newBestTime.getMilliseconds());
			start = false;
			//  A V E R A G E  T I M E 
			var newAverageTime = averageTime(times);
			$('#average').text(newAverageTime.getMinutes() + ':' + newAverageTime.getSeconds() + ':' + newAverageTime.getMilliseconds());
			//  A V E R A G E  O F  F I V E
			if (times.length >= 5){
				var newAverageOfFive = averageOfFive(times);
				$('#average-of-5').text(newAverageOfFive.getMinutes() + ':' + newAverageOfFive.getSeconds() + ':' + newAverageOfFive.getMilliseconds())
			}
			//  3  OF  5
//			if (times.length >= 5){
//				var newThreeOfFive =  threeOfFive(times);
//				$('#3-of-5').text(newThreeOfFive.getMinutes() + ':' + newThreeOfFive.getSeconds() + ':' + newThreeOfFive.getMilliseconds());				
//			}
		}
	}

	
	function displayTime(startTime){
		lastTime = new Date(new Date() - startTime);
		$('#timer-text').text(lastTime.getMinutes() + ':' + lastTime.getSeconds() + ':' + lastTime.getMilliseconds());
		console.log('updating time');
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
		timeInMs /= times.length;
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
	//	function threeOfFive(listOfTimes){
//		var fiveLastTimes = [];
//		var average = 0;
//		for (var i = 0; i < 4; i++){
//			fiveLastTimes.push(listOfTimes[i]);
//		}
//		var bestTime = new Date();
//		var worstTime = new Date(0);
//		fiveLastTimes.forEach(function(timeOuter, index, array){
//			console.log(timeOuter.getTime());
//			console.log(timeOuter.getTime());
//			if (timeOuter.getTime() < bestTime.getTime){
//				bestTime = timeOuter;
//			} else if(timeOuter.getTime > worstTime.getTime()){
//				worstTime = timeOuter;
//			}
//			
//		});
//		console.log(bestTime.getTime());
//		console.log(worstTime.getTime());
//		fiveLastTimes.forEach(function(element, index, array){
//			if (element.getTime() == bestTime.getTime() || element.getTime == worstTime.getTime){
//				fiveLastTimes.pop[index];
//			} else {
//				average += element.getTime();
//			}
//			
//		});
//		
//		average /= 3;
//		return new Date(average);
//	}
	

});









//
//
//
//
//var interval = 1000; // ms
//var expected = Date.now() + interval;
//setTimeout(step, interval);
//function step() {
//    var dt = Date.now() - expected; // the drift (positive for overshooting)
//    if (dt > interval) {
//        // something really bad happened. Maybe the browser (tab) was inactive?
//        // possibly special handling to avoid futile "catch up" run
//    }
//    … // do what is to be done
//
//    expected += interval;
//    setTimeout(step, Math.max(0, interval - dt)); // take into account drift
//}
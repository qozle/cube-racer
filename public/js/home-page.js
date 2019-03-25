$(function(){
	var handle = localStorage.getItem('handle');
	console.log(handle);
	//  S T O P W A T C H 
	var start = false;
	var displayTimer;
	var lastTime;
	var times = [];
	$('#nav-stats').attr('href', `/users/${handle}`);
	
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
			displayTimer = setInterval(displayTime, 1, startTime);
		} else if (start) {
			//  Stop the timer, push the last time 
			//  to the list of times, emit the data to the server, update the stats chart
			console.log('stopping timer');
			clearInterval(displayTimer);
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
					console.log('new time inserted')
				},
				error: (error) => {
					console.log(error);
				}
			});
			//  add time to the list of times
			$('#times-list').prepend('<li>' + ('0' + lastTime.getMinutes()).slice(-2) + ':' + ('0' + lastTime.getSeconds()).slice(-2) + '.' + ('0' + lastTime.getMilliseconds()).slice(-3) + '</li>');
			times.push(lastTime);
			
			//  Input into HTML table
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
			//  T H R E E  O F  F I V E
			if (times.length >= 5){
				var newThreeOfFive =  threeOfFive(times);
				$('#3-of-5').text(newThreeOfFive.getMinutes() + ':' + newThreeOfFive.getSeconds() + ':' + newThreeOfFive.getMilliseconds());				
			}
			//  A V E R A G E  O F  T E N
			if (times.length >= 10){
				var newAverageOfTen = averageOfTen(times);
				$('#average-of-10').text(newAverageOfTen.getMinutes() + ':' + newAverageOfTen.getSeconds() + ':' + newAverageOfTen.getMilliseconds())
			}
			//  E I G H T  O F  T E N 
			if (times.length >= 10){
				var newEightOfTen = eightOfTen(times);
				$('#8-of-10').text(newEightOfTen.getMinutes() + ':' + newEightOfTen.getSeconds() + ':' + newEightOfTen.getMilliseconds());				
			}
		}
	}

	
	function displayTime(startTime){
		lastTime = new Date(new Date() - startTime);
		$('#timer-text span:nth-child(1)').text(('0' + lastTime.getMinutes()).slice(-2) + ':'); 
		$('#timer-text span:nth-child(2)').text(('0' + lastTime.getSeconds()).slice(-2) + '.');
		$('#timer-text span:nth-child(3)').text(('00' + lastTime.getMilliseconds()).slice(-3));
		console.log('updating time');
	}
	
	
	//   L O G  O U T 
	$('#logoutButton').click(function(){
		console.log('button clicked');
		$.ajax({
			url :'/logout',
			type: 'GET',
			success: function(data){
				$('body').empty();
				$('body').append(data);
			}
		});
	});
	
	
	//  view profile
	$('#viewProfile').click(function(){
		$.ajax({
			url: '/users/lexsip237',
			type: 'GET',
			success: function(data){
				$('body').empty();
				$('body').append(data);
			}, 
			error: function(error){
				console.log(error);
			}
		});
	});
	
	
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
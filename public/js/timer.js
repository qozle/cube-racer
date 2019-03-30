$(function(){	
	
	//  Init with a first scramble
	scrambler()
	
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
		
		scrambler();
		
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
	
	
	function scrambler(){
		
		const faces = {
			U : {'allowed': true, 'allows': ['L', 'R', 'F', 'B']},
			D : {'allowed': true, 'allows': ['L', 'R', 'F', 'B']},
			L : {'allowed': true, 'allows': ['U', 'D', 'F', 'B']},
			R : {'allowed': true, 'allows': ['U', 'D', 'F', 'B']},
			F : {'allowed': true, 'allows': ['U', 'D', 'L', 'R']},
			B : {'allowed': true, 'allows': ['U', 'D', 'L', 'R']}
		};

		const faces_index = ['U', 'D', 'R', 'L', 'F', 'B'];

		//  Don't mind me, just building my own random choice function...
		function choose(array){
			var index = Math.floor(Math.random() * array.length);
			return array[index];
		}

		//  Make 25 random moves  
		var i, f, face, direction, scramble = [];
		for (i = 0; i <= 24; i++ ) {
			//  Pick a face as long as it's allowed
			do {
				face = choose(faces_index);
				console.log(faces[face]['allowed'])
			} while (!faces[face]['allowed'])
			//  Make sure we don't pick the same face twice
			faces[face]['allowed'] = false;
			//  Allow the faces on the other 2 axises
			for (f = 0;f < faces[face]['allows'].length; f++) (
				faces[faces[face]['allows'][f]]['allowed'] = true
			);
			//  Pick a random direction
			switch(Math.floor(Math.random() * 3)) {
				case 0 : direction = ""; break;
				case 1 : direction = "2"; break;
				case 2 : direction = "'"; break;
			};


			scramble.push(face + direction)

		}

		console.log(scramble)

		var moves = [ 
			scramble.splice(0,5),
			scramble.splice(0,5),
			scramble.splice(0,5),
			scramble.splice(0,5),
			scramble.splice(0,5)
		]

		var moves2 = {}


		moves.forEach((setList, mIndex)=>{
			setList.forEach((move, sIndex)=>{
				if (!moves2[mIndex]){ moves2[mIndex] = '';}
				moves2[mIndex] += move + ' ';
			});
			moves2[mIndex] = moves2[mIndex].slice(0, moves2[mIndex].length - 1);
		});

		console.log(moves2);



		//  Works, just needs to be reformatted to display pretty-like
		$('#scramble').text(
			"[" + moves2[0] + "] - " +
			"[" + moves2[1] + "] - " +
			"[" + moves2[2] + "] - " +
			"[" + moves2[3] + "] - " +
			"[" + moves2[4] + "] "
		);
		
	}
	
	
	



});


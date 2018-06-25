(function() {
	"use strict";

	// must be even
	var totalItems = 20;

	// game board
	for(var i=0; i<totalItems; i++) {
		document.getElementById('board').innerHTML += '<span id="item_'+(i+1)+'" class="item"><b></b></span>';
	}

	document.getElementById('result').innerHTML = '<p>Failures: <span id="fails">0</span><br>Time: <span id="timer">00:00:00</span></p>';

	// random pairs
	var pairs = [];
	var number = 1;
	var evenFlag = 0;
	do {
		
		// from 1 to totalItems
		var index = Math.floor(Math.random()*totalItems) + 1;

		if(typeof pairs['item_'+index] === 'undefined') {

			pairs['item_'+index] = number;
			
			if((++evenFlag)%2 === 0) {
				number++;
			}

		}

	} while (number <= totalItems/2);

	// fails counter
	var setFails = function(val) {
		document.getElementById('fails').innerText = val;
	}

	// zero padding
	var setPad = function(val) {
		return (val < 10 ? '0' : '')+val;
	}

	// timer
	var timerInt = null;
	var startTimer = function() {
		var totalSeconds = 0;
		timerInt = setInterval(function() {
			totalSeconds++;
			document.getElementById('timer').innerText = setPad(parseInt(totalSeconds / 3600)) + ':' + setPad(parseInt(totalSeconds / 60) % 60) + ':' + setPad(totalSeconds % 60);
		}, 1000);
	}
	var stopTimer = function() {
		clearInterval(timerInt);
	}

	// game actions
	var fails = 0;
	var done = 0;
	var openedItem = null;
	var disableClick = false;
	var items = document.getElementsByClassName('item');
	for(var i=0; i<items.length; i++) {
		(function(index) {
			items[index].onclick = function() {

				if(timerInt === null) {
					startTimer();
				}

				if(!disableClick) {
				
					var item = items[index];

					if(!item.classList.contains('done')) {

						var pair = pairs[item.getAttribute('id')];
						var itemText = item.getElementsByTagName('b')[0];

						itemText.innerText = setPad(pair);
						itemText.classList.add('active');

						// css classes
						if(item.classList.contains('opened')) {
							item.classList.remove('opened');
						} else {
							item.classList.add('opened');
						}
						
						// pair comparison
						if(openedItem === null) {

							// just one item opened
							openedItem = item;

						} else if(openedItem !== item && pairs[openedItem.getAttribute('id')] === pair) {
							
							// pair matched
							disableClick = true;
							setTimeout(function() {
								item.classList.add('done');
								item.classList.remove('opened');
								openedItem.classList.add('done');
								openedItem.classList.remove('opened');
								openedItem = null;
								disableClick = false;
								if(++done*2 == totalItems) {
									stopTimer();
									document.getElementById('board').innerHTML = '<p>Congratulations!<br><a href="./">play again</p>';
								}
							}, 500);

						} else {

							// no match
							disableClick = true;
							setTimeout(function() {
								
								var openedItemText = openedItem.getElementsByTagName('b')[0];

								item.classList.remove('opened');
								openedItem.classList.remove('opened');

								itemText.classList.remove('active');
								openedItemText.classList.remove('active');

								setTimeout(function() {
									itemText.innerText = '';
									openedItemText.innerText = '';
									openedItem = null;
									disableClick = false;
								}, 500);

								if(openedItem !== item) {
									setFails(++fails);
								}

							}, 500);

						}

					}

				}

			}
		})(i);
	}

})();

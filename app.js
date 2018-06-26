(() => {
	"use strict";

	// must be even
	var totalItems = 20;

	// game board
	var makeBoard = () => {
		for(var i=0; i<totalItems; i++) {
			document.getElementById('board').innerHTML += '<span id="item_'+(i+1)+'" class="item"><b></b></span>';
		}
		document.getElementById('result').innerHTML = '<p>Failures: <span id="fails">0</span><br>Time: <span id="timer">00:00:00</span></p>';
	}

	// random pairs
	var pairs = [];
	var createPairs = () => {
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
	}

	// zero padding
	var setPad = (val) => (val < 10 ? '0' : '')+val;

	// timer
	var timerInt = null;
	var startTimer = () => {
		var totalSeconds = 0;
		timerInt = setInterval(() => {
			totalSeconds++;
			document.getElementById('timer').innerText = setPad(parseInt(totalSeconds / 3600)) + ':' + setPad(parseInt(totalSeconds / 60) % 60) + ':' + setPad(totalSeconds % 60);
		}, 1000);
	}
	var stopTimer = () => clearInterval(timerInt);

	// game actions
	var startGame = () => {
		var fails = 0;
		var done = 0;
		var openedItem = null;
		var disableClick = false;
		var items = document.getElementsByClassName('item');
		for(var index=0; index<items.length; index++) {

			// item clicked
			items[index].onclick = (e) => {

				if(timerInt === null) {
					startTimer();
				}

				if(!disableClick) {
					
					var item = e.target;

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
							setTimeout(() => {
								item.classList.add('done');
								item.classList.remove('opened');
								openedItem.classList.add('done');
								openedItem.classList.remove('opened');
								openedItem = null;
								disableClick = false;
								setTimeout(() => {
									if(++done*2 == totalItems) {
										// game finished
										stopTimer();
										document.getElementById('result').innerHTML += '<p>Congratulations!<br><a href="./">play again</p>';
									}
								}, 1000);
							}, 500);

						} else {

							// no match
							disableClick = true;
							setTimeout(() => {
								
								var openedItemText = openedItem.getElementsByTagName('b')[0];

								item.classList.remove('opened');
								openedItem.classList.remove('opened');

								itemText.classList.remove('active');
								openedItemText.classList.remove('active');

								setTimeout(() => {
									itemText.innerText = '';
									openedItemText.innerText = '';
									openedItem = null;
									disableClick = false;
								}, 500);

								if(openedItem !== item) {
									document.getElementById('fails').innerText = ++fails;
								}

							}, 500);

						}

					}

				}

			}

		}

	}

	/* the flow */
	makeBoard();
	createPairs();
	startGame();

})();

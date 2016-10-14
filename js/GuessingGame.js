'use strict'
/*jslint browser: true*/ /*global  $*/


const MIN_NUMBER = 1;
const MAX_NUMBER = 100;


function generateWinningNumber( min = MIN_NUMBER , max = MAX_NUMBER ) {
	return min + Math.round( Math.random() * ( max - min ) );
}

function shuffle( arr ) {
	let m = arr.length - 1;
	let i;
	let temp;

	while ( m ) {
		i = Math.round( Math.random() * m );
		temp = arr[ i ];
		arr[ i ] = arr[ m ];
		arr[ m ] = temp;
		m--;
	}

	return arr;
}

class Game {
	constructor() {
		this.playersGuess = null;
		this.pastGuesses = [];
		this.winningNumber = generateWinningNumber();
	}

	difference() {
		return Math.abs( this.playersGuess - this.winningNumber );
	}

	isLower() {
		return this.winningNumber - this.playersGuess > 0;
	}

	playersGuessSubmission( num ) {
		if ( num < MIN_NUMBER || num > MAX_NUMBER || typeof num !== 'number' || isNaN(num)) {
			throw 'That is an invalid guess.';
		}
		this.playersGuess = num;
		return this.checkGuess();
	}

	checkGuess() {
		let diff;

		if ( this.pastGuesses.indexOf( this.playersGuess ) !== -1 ) {
			return 'You have already guessed that number.';
		}
		if ( this.playersGuess === this.winningNumber ) {
			return 'You Win!';
		}

		this.pastGuesses.push( this.playersGuess );
		
		if ( this.pastGuesses.length == 5) {
			return 'You Lose.';
		}
		
		diff = this.difference();

		return diff < 10 ? 'You\'re burning up!' 
				: diff < 25 ? 'You\'re lukewarm.'
					: diff < 50 ? 'You\'re a bit chilly.'
						: 'You\'re ice cold!';
	}

	provideHint() {
		return shuffle([ this.winningNumber, generateWinningNumber(), 
						 generateWinningNumber() ]);
	}
}

function newGame() {
	return new Game();
}

///////////////////////////////////////////////////////////
//						QUERY Calls						//
//////////////////////////////////////////////////////////

// Helper function 

function htmlUpdate(game, guess) {

try {
	var gameResponse = game.playersGuessSubmission(+guess);


	if (gameResponse != 'You have already guessed that number.') {
		$('#guesses').find('.guess-empty:first').text(guess).addClass('guess-entered')
			.removeClass('guess-empty');
	} 

	if (gameResponse == 'You Win!' || gameResponse == 'You Lose.') {
		$('#headers').find('h1').text(gameResponse);
		$('#headers').find('h2').text('press reset to play again.');
		$('#submit').prop( 'disabled', true);
		$('#hint').prop( 'disabled', true);
	} else if (gameResponse != 'You have already guessed that number.') {
		$('#headers').find('h1').text(gameResponse);
		$('#headers').find('h2').text(game.isLower() ? 'Guess Higher' : 'Guess Lower');
	} else {
		$('#headers').find('h1').text(gameResponse);
		$('#headers').find('h2').text('Guess again.');
	}
} catch( err ) { 
	console.log( err ); 
}
}

// Event handlers

$(document).ready(function() {

	var game = newGame();
	var guess;

	$( '#reset' ).on('click', function(e) {
		e.preventDefault();

		game = newGame();

		$('#guesses').find('.guess-entered').text('-').addClass('guess-empty')
			.removeClass('guess-entered');
		$('#headers').find('h1').text('Guessing Game');
		$('#headers').find('h2').text('Guess a number between 1 and 100');
		$('#submit').prop( 'disabled', false);
		$('#hint').prop( 'disabled', false);
	});


	$( '#hint' ).on( 'click', function(e) {
		e.preventDefault();
		$('#headers').find('h1').text('Ok, I\'ll help you out, this 1 time...');
		$('#headers').find('h2').text('the number is in set: ' + game.provideHint().sort());
		$('#hint').prop( 'disabled', true)
	})
	$( '#submit' ).on( 'click', function(e) { 
		e.preventDefault();
		guess = $( '#player-input').val();
		$('#player-input').val('');
		htmlUpdate ( game, guess );
	});

	$( '.input-parent').on('keyup', function (e) {
		if( e.keyCode == 13) {
			$('.#submit').trigger('click');
		}
	});
});
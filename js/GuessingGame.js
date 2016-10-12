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
		if ( num < MIN_NUMBER || num > MAX_NUMBER || typeof num !== 'number' ) {
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


window.onload = () => {
	const grid = document.querySelector('.grid');
	const score = document.getElementById('score');
	const result = document.getElementById('result');

	let styles = { '0': 'empty-cell', '2': 'two', '4': 'four', '8': 'eight', '16': 'sixteen', '32': 'thirtytwo' };

	const COLS = 4;
	const ROWS = 4;

	let cells = [];

	// create grid
	createGrid = () => {
		for (let i = 0; i < COLS * ROWS; i++) {
			const cell = document.createElement('div');
			cell.innerHTML = '0';
			grid.appendChild(cell);
			cells.push(cell);
		}
	};

	// add number at random position
	addCell = () => {
		let rn = Math.floor(Math.random() * cells.length);
		if (cells[rn].innerHTML == '0') {
			cells[rn].innerHTML = 2;
		} else addCell();
	};

	moveVertically = (direction) => {
		for (let j = 0; j < ROWS; j++) {
			// go through all columns
			// take all column
			let currentCol = [];

			for (let i = 0; i < COLS; i++) {
				currentCol.push(parseInt(cells[i * COLS + j].innerHTML));
			}

			let filteredCol = currentCol.filter((num) => num);

			let missing = ROWS - filteredCol.length;
			let zeros = Array(missing).fill('0');

			let newCol;
			if (direction == 'up') {
				newCol = filteredCol.concat(zeros);
			} else if (direction == 'down') {
				newCol = zeros.concat(filteredCol);
			}

			// replace old column with a new column
			for (let i = 0; i < ROWS; i++) {
				cells[i * ROWS + j].innerHTML = newCol[i];
			}
		}
	};

	moveHorizontally = (direction) => {
		for (let i = 0; i < ROWS; i++) {
			// beggining of each row
			// grab all row
			let currentRow = [];

			for (let j = 0; j < COLS; j++) {
				currentRow.push(parseInt(cells[i * COLS + j].innerHTML));
			}

			let filteredRow = currentRow.filter((num) => num);

			let missing = COLS - filteredRow.length;
			let zeros = Array(missing).fill('0');

			let newRow;
			if (direction == 'left') {
				newRow = filteredRow.concat(zeros);
			} else if (direction == 'right') {
				newRow = zeros.concat(filteredRow);
			}

			// replace old row with a new row
			for (let j = 0; j < COLS; j++) {
				cells[i * COLS + j].innerHTML = newRow[j];
			}
		}
	};

	combineRows = () => {
		for (let i = 0; i < ROWS * COLS - 1; i++) {
			if (cells[i].innerHTML === cells[i + 1].innerHTML) {
				let combined = parseInt(cells[i].innerHTML) + parseInt(cells[i + 1].innerHTML);
				cells[i].innerHTML = combined;
				cells[i + 1].innerHTML = '0';
				score.innerHTML = parseInt(score.innerHTML) + combined;
			}
		}
	};

	combineCols = () => {
		for (let j = 0; j < ROWS * COLS - ROWS; j++) {
			if (cells[j].innerHTML === cells[j + ROWS].innerHTML) {
				let combined = parseInt(cells[j].innerHTML) + parseInt(cells[j + ROWS].innerHTML);
				cells[j].innerHTML = combined;
				cells[j + ROWS].innerHTML = '0';
				score.innerHTML = parseInt(score.innerHTML) + combined;
			}
		}
	};

	keyboardControl = (evt) => {
		switch (evt.keyCode) {
			case 39:
				keyRight();
				break;
			case 37:
				keyLeft();
				break;
			case 38:
				keyUp();
				break;
			case 40:
				keyDown();
				break;
		}
		applyStyle();
		checkGameOver();
	};

	keyRight = () => {
		moveHorizontally('right');
		combineRows();
		moveHorizontally('right');
		addCell();
	};

	keyLeft = () => {
		moveHorizontally('left');
		combineRows();
		moveHorizontally('left');
		addCell();
	};

	keyUp = () => {
		moveVertically('up');
		combineCols();
		moveVertically('up');
		addCell();
	};

	keyDown = () => {
		moveVertically('down');
		combineCols();
		moveVertically('down');
		addCell();
	};

	applyStyle = () => {
		for (let i = 0; i < cells.length; i++) {
			cells[i].className = styles[cells[i].innerHTML];
		}
	};

	checkGameOver = () => {
		let nonZero = 0,
			moves = 0;
		goalReached = false;
		for (let i = 0; i < ROWS; i++) {
			for (let j = 0; j < COLS; j++) {
				let currCell = cells[i * COLS + j].innerHTML;
				if (currCell != '0') nonZero++;

				if (currCell == '2048') goalReached = true;
				if (
					(i > 0 && cells[(i - 1) * COLS + j].innerHTML == currCell) ||
					(j > 0 && cells[i * COLS + j - 1].innerHTML == currCell) ||
					(i + 1 < ROWS && cells[(i + 1) * COLS + j].innerHTML == currCell) ||
					(j + 1 < COLS && cells[i * COLS + j + 1].innerHTML == currCell)
				) {
					moves++;
				}
			}
		}

		if (moves == 0 && nonZero == cells.length) handleLose();
		else if (goalReached) handleWin();
	};

	handleLose = () => {
		result.innerHTML = 'Game Over, You Lost';
		document.removeEventListener('keydown', keyboardControl);
	};

	handleWin = () => {
		result.innerHTML = 'You Won, Congratulation!';
		let scoreDiv = document.createElement('div');
		scoreDiv.innerHTML = `Your final score is: ${score.innerHTML}`;
		result.appendChild(scoreDiv);
	};

	document.addEventListener('keydown', keyboardControl);

	createGrid();

	addCell();

	applyStyle();
};

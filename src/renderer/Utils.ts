import { getRandomValues } from "crypto";

export const EMPTY_SQUARE_VALUE: number = -1;

export enum SquareStatus {
	Default,	// User can not change its value
	Writable,	// user can change its value (empty when game start) 
	Filled,	// User has changed its value (may be ok, or not ;)
}

export interface Square {
	value: number;
	status: SquareStatus;
}

export interface Board {
	rows: number[][];
	tiles: number[][];
	columns: number[][];
	squares: Square[];
}

export const Utils = {

	getRowNumber: (id: number): number => {
		return Math.trunc(id / 9);
	},

	getColumnNumber: (id: number): number => {
		return id % 9;
	},

	getTileNumber: (id: number): number => {
		return Math.trunc(id / (9 * 3)) * 3 + Math.trunc((id % 9) / 3);
	},

	getRowValues: (idRow: number, board: Board): number[] => {
		const values: number[] = [];

		board.rows[idRow].forEach((element) => {
			values.push(board.squares[element].value);
		});

		return values;
	},

	getColumnValues: (idColumn: number, board: Board): number[] => {
		const values: number[] = [];

		board.columns[idColumn].forEach((element) => {
			values.push(board.squares[element].value);
		});

		return values;
	},

	getTileValues: (idTile: number, board: Board): number[] => {
		const values: number[] = [];

		board.tiles[idTile].forEach((element) => {
			values.push(board.squares[element].value);
		});

		return values;
	},

	availableValues: (id: number, board: Board): number[] => {

		const defaults = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		const row = Utils.getRowValues(Utils.getRowNumber(id), board);
		const column = Utils.getColumnValues(Utils.getColumnNumber(id), board);
		const tile = Utils.getTileValues(Utils.getTileNumber(id), board);

		const values = defaults.filter((element) => !row.includes(element) && !column.includes(element) && !tile.includes(element));

		return values;
	},

	getRandomNumber: (min: number, max: number): number => {
		return Math.floor(Math.random() * max) + min;
	},

	setupBoard: (): Board => {

		let board = Utils.createEmptyBoard();

		board = Utils.fillBoard(60, board);

		return board;
	},

	fillBoard: (nbSquareToFill: number, board: Board): Board => {

		let rand: number = 0;
		let possibleValues: number[] = [];

		const ratio = nbSquareToFill / 81;

		// Fill the board with random values
		for (let index = 0; index < 81; index++) {

			rand = Utils.getRandomNumber(1, 10) / 10;

			if (rand > ratio) {

				// Get possible values for the index
				possibleValues = Utils.availableValues(index, board);

				if (possibleValues.length != 0) {
					// Get a random value from all possible values for the index
					rand = possibleValues[Utils.getRandomNumber(0, possibleValues.length)];

					// Fill the square with th random value
					board.squares[index] = { value: rand, status: SquareStatus.Default };
				}
			}
		}

		return board;
	},

	createEmptyBoard: (): Board => {

		const board: Board = {
			rows: [],
			tiles: [],
			columns: [],
			squares: [],
		};

		// Setup sub arrays
		let row: number[] = [];
		let tile: number[] = [];
		let column: number[] = [];

		for (let i = 0; i < 9; i++) {
			board.rows.push(row);
			row = [];
			board.tiles.push(tile);
			tile = [];
			board.columns.push(column);
			column = [];
		}

		let rowId: number = 0;
		let tileRow: number = Math.floor(rowId / 3);
		let columnId: number = 0;

		let index: number = 0;

		// Index the board with rows, columns and tiles
		for (index = 1; index <= 81; index++) {

			// Default value to fill the board
			board.squares[index - 1] = { value: EMPTY_SQUARE_VALUE, status: SquareStatus.Writable };

			// rows
			board.rows[rowId].push(index - 1);

			// tiles
			if (board.rows[rowId].length <= 3) {
				board.tiles[tileRow * 3].push(index - 1);
			} else {
				if (board.rows[rowId].length <= 6) {
					board.tiles[tileRow * 3 + 1].push(index - 1);
				} else {
					if (board.rows[rowId].length <= 9) {
						board.tiles[tileRow * 3 + 2].push(index - 1);
					}
				}
			}

			// id of current row and row of current tile
			if (index >= (rowId + 1) * 9) {
				rowId += 1;
				tileRow = Math.floor(rowId / 3);
			}

			// columns
			board.columns[columnId].push(index - 1);
			if (columnId < 8) {
				columnId++;
			} else {
				columnId = 0;
			}
		}

		return board;
	}
};

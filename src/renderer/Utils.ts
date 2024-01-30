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

	getRowId: (id: number): number => {
		return Math.trunc(id / 9);
	},

	getColumnId: (id: number): number => {
		return id % 9;
	},

	getTileId: (id: number): number => {
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

	getPossibleValues: (id: number, board: Board): number[] => {

		const defaults = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		const row = Utils.getRowValues(Utils.getRowId(id), board);
		const column = Utils.getColumnValues(Utils.getColumnId(id), board);
		const tile = Utils.getTileValues(Utils.getTileId(id), board);

		const values = defaults.filter((element) => !row.includes(element) && !column.includes(element) && !tile.includes(element));

		return values;
	},

	getRandomNumber: (min: number, max: number): number => {
		return Math.floor(Math.random() * max) + min;
	},

	newBoard: (difficulty: number): Board => {

		let board = Utils.createEmptyBoard();

		board = Utils.fillBoard(board);

		return board;
	},

	/**
	 * Gets the ids of neighbour row or column for the same tile.
	 * @param id of a row or a column
	 * @returns Two ids of neighbour row or column
	 */
	getNeighbourIds: (id: number): { id1: number, id2: number } => {

		// Return neighbour on right +1 and +2
		if ([0, 3, 6].includes(id)) {
			return { id1: id + 1, id2: id + 2 };
		} else {
			// Return neighbour on left -1 and right +1
			if ([1, 4, 7].includes(id)) {
				return { id1: id - 1, id2: id + 1 };
			} else {
				// Return neighbour on left -1 and -2
				return { id1: id - 1, id2: id - 2 };
			}
		}
	},

	getRequiredRowValues: (id: number, board: Board): number[] => {

		const rowId = Utils.getRowId(id);
		const possibleValues = Utils.getPossibleValues(id, board);
		const rowNeighbour = Utils.getNeighbourIds(rowId);
		const valuesOfRowNeighbour1 = Utils.getRowValues(rowNeighbour.id1, board);
		const valuesOfRowNeighbour2 = Utils.getRowValues(rowNeighbour.id2, board);

		const requiredRowValues = possibleValues.filter((element) => {
			return valuesOfRowNeighbour1.includes(element) && valuesOfRowNeighbour2.includes(element)
		})


		return requiredRowValues;
	},

	getRequiredColumnValues: (id: number, board: Board): number[] => {

		const columnId = Utils.getColumnId(id);
		const possibleValues = Utils.getPossibleValues(id, board);
		const columnNeighbour = Utils.getNeighbourIds(columnId);
		const valuesOfColumnNeighbour1 = Utils.getColumnValues(columnNeighbour.id1, board);
		const valuesOfColumnNeighbour2 = Utils.getColumnValues(columnNeighbour.id2, board);

		const requiredColumnValues = possibleValues.filter((element) => {
			return valuesOfColumnNeighbour1.includes(element) && valuesOfColumnNeighbour2.includes(element)
		})


		return requiredColumnValues;
	},

	getRequiredValues: (id: number, board: Board): number[] => {

		// merge arrays required column value and required row value
		const requiredValues: number[] = [...new Set([...Utils.getRequiredColumnValues(id, board), ...Utils.getRequiredRowValues(id, board)])].sort()

		return requiredValues;

	},

	fillBoard: (board: Board): Board => {

		// let counter = 10;

		// while (counter <= 10) {
			try {
				for (let number = 1; number <= 9; number++) {
					[4, 1, 7, 3, 5, 0, 2, 6, 8].forEach((element) => {
						board = Utils.fillTile(element, number, board);

					});
				}
			} catch (error) {
				console.log(error);
				return Utils.createEmptyBoard();
				// counter++;
			}
		// }

		return board;

		// return counter >= 10 ? Utils.createEmptyBoard() : board;
	},

	fillTile: (tileId: number, value: number, board: Board): Board => {

		const tile = board.tiles[tileId];

		let randomIndex = 0;

		let possibleIndex: number[] = tile.filter((element) => {
			return board.squares[element].value === EMPTY_SQUARE_VALUE
				&& Utils.getPossibleValues(element, board).includes(value);
		})

		if (0 === possibleIndex.length) {
			throw new Error(`There is no available square for ${value} in tile ${tileId}`);
		}

		randomIndex = possibleIndex[Utils.getRandomNumber(0, possibleIndex.length)];

		return Utils.fillSquare(randomIndex, value, board);
	},

	fillSquare: (index: number, squareValue: number, board: Board): Board => {

		board.squares[index] = { value: squareValue, status: SquareStatus.Default };

		return board;
	},

	fillSquareWithRandomValue: (index: number, board: Board): Board => {

		let possibleValues: number[] = [];
		let requiredValues: number[] = [];
		let value = 0;

		requiredValues = Utils.getRequiredValues(index, board);
		// Si certaines valeurs sont obligatoires, prendre la première
		if (requiredValues.length > 0) {
			value = requiredValues[Utils.getRandomNumber(0, requiredValues.length)];
		} else {
			// Sinon remplir avec la première valeur possible
			possibleValues = Utils.getPossibleValues(index, board);
			value = possibleValues[Utils.getRandomNumber(0, possibleValues.length)];
		}

		return Utils.fillSquare(index, value, board);
	},

	randomBoard: (nbSquareToFill: number, board: Board): Board => {

		let index: number = 0;
		let random: number = 0;
		let possibleValues: number[] = [];
		let requiredValues: number[] = [];
		let isOk: boolean = false;


		// Fill the board with random values
		for (let nbSquareFilled = 0; nbSquareFilled < nbSquareToFill;) {

			// Cherche une case vide
			while (!isOk) {
				index = Utils.getRandomNumber(0, 81);

				// console.log(`index ${index}`);

				isOk = board.squares[index].value === EMPTY_SQUARE_VALUE;
				// console.log(`isOk ? ${isOk}`);
			}

			requiredValues = Utils.getRequiredValues(index, board);

			// Si certaines valeurs sont obligatoires
			if (requiredValues.length > 0) {
				random = requiredValues[Utils.getRandomNumber(0, requiredValues.length)];
				board.squares[index] = { value: random, status: SquareStatus.Default };
			} else {
				// Sinon remplir avec une valeur possible
				possibleValues = Utils.getPossibleValues(index, board);
				random = possibleValues[Utils.getRandomNumber(0, possibleValues.length)];
				board.squares[index] = { value: random, status: SquareStatus.Default };
			}

			// Une case est remplie
			nbSquareFilled++;
			// Prêt pour chercher une autre case
			isOk = false;
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

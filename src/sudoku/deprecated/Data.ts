export const EMPTY_SQUARE_VALUE: number = -1;

export const SAVE_TOPIC: string = 'save-sudolu';
export const LOAD_TOPIC: string = 'load-sudolu';

export enum SquareStatus {
	Default,	// User can not change its value
	Writable,	// user can change its value (empty when game start) 
	Filled,	// User has changed its value (may be ok, or not ;)
}

export interface Square {
	value: number;
	status: SquareStatus;
}

export interface Row {
	coords: number[];
}

export interface Column {
	coords: number[];
}

export interface Tile {
	coords: number[];
}

export interface Sudoku {
	rows: Row[];
	tiles: Tile[];
	columns: Column[];
	squares: Square[];
}

export const Utils = {

	getRowId: (coord: number): number => {
		return Math.trunc(coord / 9);
	},

	getColumnId: (coord: number): number => {
		return coord % 9;
	},

	getTileId: (coord: number): number => {
		return Math.trunc(coord / (9 * 3)) * 3 + Math.trunc((coord % 9) / 3);
	},

	getRowValues: (rowId: number, sudoku: Sudoku): number[] => {
		const values: number[] = [];

		sudoku.rows[rowId].coords.forEach((coord: number) => {
			values.push(sudoku.squares[coord].value);
		});

		return values;
	},

	getColumnValues: (columnId: number, sudoku: Sudoku): number[] => {
		const values: number[] = [];

		sudoku.columns[columnId].coords.forEach((coord) => {
			values.push(sudoku.squares[coord].value);
		});

		return values;
	},

	getTileValues: (tileId: number, sudoku: Sudoku): number[] => {
		const values: number[] = [];

		sudoku.tiles[tileId].coords.forEach((coord) => {
			values.push(sudoku.squares[coord].value);
		});

		return values;
	},

	getPossibleValues: (coord: number, sudoku: Sudoku): number[] => {

		const defaults = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		const row = Utils.getRowValues(Utils.getRowId(coord), sudoku);
		const column = Utils.getColumnValues(Utils.getColumnId(coord), sudoku);
		const tile = Utils.getTileValues(Utils.getTileId(coord), sudoku);

		const values = defaults.filter((element) => !row.includes(element) && !column.includes(element) && !tile.includes(element));

		return values;
	},

	newSquare: (): Square => {

		const square: Square = { value: EMPTY_SQUARE_VALUE, status: SquareStatus.Writable };

		return square;
	},

	newRow: (): Row => {
		return {coords: []};
	},

	newColumn: (): Column => {
		return {coords: []};
	},

	newTile: (): Tile => {
		return {coords: []};
	},

	newSudoku: (): Sudoku => {
		
		const sudoku: Sudoku = {
			rows: [],
			tiles: [],
			columns: [],
			squares: [],
		}

		for (let i = 0; i < 9; i++) {
			sudoku.rows.push(Utils.newRow());
			sudoku.tiles.push(Utils.newTile());
			sudoku.columns.push(Utils.newColumn());
		}

		for(let i = 0; i < 9 * 9; i++) {
			sudoku.squares.push(Utils.newSquare());
		}

		return sudoku;
	}
}
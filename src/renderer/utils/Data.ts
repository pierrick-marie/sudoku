export const EMPTY_SQUARE_VALUE: number = -1;

export enum SquareStatus {
	Default,	// User can not change its value
	Writable,	// user can change its value (empty when game start) 
	Filled,	// User has changed its value (may be ok, or not ;)
}

export interface SquareData {
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

export interface SudokuData {
	rows: Row[];
	tiles: Tile[];
	columns: Column[];
	squares: SquareData[];
}
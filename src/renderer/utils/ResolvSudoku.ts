
import {Utils, SudokuData, Tile, EMPTY_SQUARE_VALUE} from './Data';

const IDS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const VALUES: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const Resolv = {

	isValid(sudoku: SudokuData): boolean {

		return (
			Resolv.allSquareAreFilled(sudoku) && 
			Resolv.allColumnsAreOk(sudoku) && 
			Resolv.allRowsAreOk(sudoku) && 
			Resolv.allTilesAreOk(sudoku)
		);
	},

	allSquareAreFilled(sudoku: SudokuData): boolean {
		
		return sudoku.squares.every((square) => {
			return EMPTY_SQUARE_VALUE != square.value}
		);
	},

	allTilesAreOk(sudoku: SudokuData): boolean {

		return IDS.every((tileId: number) => {
			return Resolv.tileIsOk(tileId, sudoku);
		});
	},

	allRowsAreOk(sudoku: SudokuData): boolean {

		return IDS.every((rowId: number) => {
			return Resolv.rowIsOk(rowId, sudoku);
		});
	},

	allColumnsAreOk(sudoku: SudokuData): boolean {

		return IDS.every((columnId: number) => {
			return Resolv.columnIsOk(columnId, sudoku);
		});
	},

	tileIsOk(tileId: number, sudoku: SudokuData): boolean {

		const tileValues: number[] = Utils.getTileValues(tileId, sudoku);

		return 9 === tileValues.length && this.checkValues(tileValues); 
	}, 

	rowIsOk(rowId: number, sudoku: SudokuData): boolean {

		const rowValues: number[] = Utils.getRowValues(rowId, sudoku);

		return 9 === rowValues.length && this.checkValues(rowValues); 
	}, 

	columnIsOk(columnId: number, sudoku: SudokuData): boolean {

		const columnValues: number[] = Utils.getColumnValues(columnId, sudoku);

		return 9 === columnValues.length && this.checkValues(columnValues); 
	}, 

	checkValues(values: number[]): boolean {
	
		return VALUES.every((value: number) => {
			return values.includes(value);
		})
	}
}
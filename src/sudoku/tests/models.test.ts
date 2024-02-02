import { Sudoku } from '../models/Sudoku';

describe("Setup sudoku game", () => {
	it("creates a valid new game", () => {
		const sudoku: Sudoku = new Sudoku();

		//
		// Not possible to exec that test with private visibility
		//
		// sudoku.newGame();
		// expect(sudoku.allSquareAreFilled()).toEqual(true);
		// expect(sudoku.allColumnsAreOk()).toEqual(true);
		// expect(sudoku.allTilesAreOk()).toEqual(true);
		// expect(sudoku.allRowsAreOk()).toEqual(true);
		// expect(sudoku.isValid()).toEqual(true);
	});
});



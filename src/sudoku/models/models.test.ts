import { Sudoku } from './Sudoku';

describe("Setup sudoku game", () => {
	it("creates a valid new game", () => {
		const sudoku: Sudoku = new Sudoku();
		sudoku.newGame();

		expect(sudoku.allSquareAreFilled()).toEqual(true);
		expect(sudoku.allColumnsAreOk()).toEqual(true);
		expect(sudoku.allTilesAreOk()).toEqual(true);
		expect(sudoku.allRowsAreOk()).toEqual(true);
		expect(sudoku.isValid()).toEqual(true);
	});
});



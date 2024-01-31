import {Row, Column, Tile, SudokuData, SquareStatus, SquareData, EMPTY_SQUARE_VALUE} from './Data';

export const Sudoku = {

	getRowId: (coord: number): number => {
		return Math.trunc(coord / 9);
	},

	getColumnId: (coord: number): number => {
		return coord % 9;
	},

	getTileId: (coord: number): number => {
		return Math.trunc(coord / (9 * 3)) * 3 + Math.trunc((coord % 9) / 3);
	},

	getRowValues: (rowId: number, sudoku: SudokuData): number[] => {
		const values: number[] = [];

		sudoku.rows[rowId].coords.forEach((coord: number) => {
			values.push(sudoku.squares[coord].value);
		});

		return values;
	},

	getColumnValues: (columnId: number, sudoku: SudokuData): number[] => {
		const values: number[] = [];

		sudoku.columns[columnId].coords.forEach((coord) => {
			values.push(sudoku.squares[coord].value);
		});

		return values;
	},

	getTileValues: (tileId: number, sudoku: SudokuData): number[] => {
		const values: number[] = [];

		sudoku.tiles[tileId].coords.forEach((coord) => {
			values.push(sudoku.squares[coord].value);
		});

		return values;
	},

	getPossibleValues: (coord: number, sudoku: SudokuData): number[] => {

		const defaults = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		const row = Sudoku.getRowValues(Sudoku.getRowId(coord), sudoku);
		const column = Sudoku.getColumnValues(Sudoku.getColumnId(coord), sudoku);
		const tile = Sudoku.getTileValues(Sudoku.getTileId(coord), sudoku);

		const values = defaults.filter((element) => !row.includes(element) && !column.includes(element) && !tile.includes(element));

		return values;
	},

	getRandomNumber: (min: number, max: number): number => {
		return Math.floor(Math.random() * max) + min;
	},

	newSudoku: (difficulty: number): SudokuData => {

		let sudoku = Sudoku.createFilledSudoku();
		
		sudoku = Sudoku.hideSquares(difficulty, sudoku);

		return sudoku;
	},

	hideSquares(numberOfSquareToHide: number, sudoku: SudokuData): SudokuData {

		let randomCoord: number = Sudoku.getRandomNumber(0, 81);
		const hidedSquareList: number[] = [];

		for(let i = 0; i < numberOfSquareToHide; ) {
			if(!hidedSquareList.includes(randomCoord)) {
				sudoku.squares[randomCoord] = { value: EMPTY_SQUARE_VALUE, status: SquareStatus.Writable };
				hidedSquareList.push(randomCoord);
				i++;
			}
			randomCoord = Sudoku.getRandomNumber(0, 81);
		}

		return sudoku;
	},

	createFilledSudoku: (): SudokuData => {

		let sudoku = Sudoku.createEmptySudoku();

		let coords: number[] = [];

		for (let number = 1; number <= 9; number++) {

			coords = Sudoku.searchNineCoords(number, sudoku);

			if (9 != coords.length) {
				number = 0;
				sudoku = Sudoku.createEmptySudoku();
			} else {
				coords.forEach((coord) => {
					sudoku = Sudoku.fillSquare(coord, number, sudoku);
				});
			}
		}

		return sudoku;
	},

	searchNineCoords: (value: number, sudoku: SudokuData): number[] => {

		// liste des coords à renvoyer
		const coords: number[] = [];
		// liste des coords blacklistées
		const blackList: number[] = [];
		// Pour chaque coord, la ligne correspondante
		const rowList: number[] = [];
		// Pour chaque coord, la tuile correspondante
		const tileList: number[] = [];
		// Une colonne dans laquelle recherche une coordonnées
		let column: Column;
		// Liste des coords possibles
		let possibleCoords: number[];
		// Coord aléatoire
		let randomCoord: number = 0;
		// Maximum try counter
		let nbTry: number = 0;
		// Maximum try 
		const maxTry: number = 81 - 9 * (value - 1);

		while (coords.length < 9 && nbTry < maxTry) {

			nbTry++;

			// Colonne dans laquelle chercher une coord
			column = sudoku.columns[coords.length];

			// Parcours toutes les coords de la colonne
			possibleCoords = column.coords.filter((coord) => {
				return (
					// square est vide  
					sudoku.squares[coord].value === EMPTY_SQUARE_VALUE
					// square n'est pas blaclisté
					&& !blackList.includes(coord)
					// square ne correspond pas à une ligne déja prise
					&& !rowList.includes(Sudoku.getRowId(coord))
					// square ne correspond pas à une tuile déja prise
					&& !tileList.includes(Sudoku.getTileId(coord))
				);
			});

			// Pas de coord possible pour les autres colonnes 
			if (0 === possibleCoords.length) {
				// supprime la dernière coord et la place dans la blaclist
				let lastCoord = coords.pop();
				if (lastCoord != undefined) {
					blackList.push(lastCoord);
					rowList.pop();
					tileList.pop();
				}
			} else {
				// Il y a des coord de disponibles
				// Prend une coord au hasar et l'ajoute dans la liste des coords
				randomCoord = possibleCoords[Sudoku.getRandomNumber(0, possibleCoords.length)];
				coords.push(randomCoord);
				rowList.push(Sudoku.getRowId(randomCoord));
				tileList.push(Sudoku.getTileId(randomCoord));
			}
		}

		return coords;
	},

	fillSquare: (coord: number, squareValue: number, sudoku: SudokuData): SudokuData => {

		sudoku.squares[coord] = { value: squareValue, status: SquareStatus.Default };

		return sudoku;
	},

	createEmptySudoku: (): SudokuData => {

		const sudoku: SudokuData = {
			rows: [],
			tiles: [],
			columns: [],
			squares: [],
		};

		// Setup sub arrays
		let row: Row = {coords: []};
		let tile: Tile = {coords: []};
		let column: Column = {coords: []};

		for (let i = 0; i < 9; i++) {
			sudoku.rows.push(row);
			row = {coords: []};
			sudoku.tiles.push(tile);
			tile = {coords: []};
			sudoku.columns.push(column);
			column = {coords: []};
		}

		let rowId: number = 0;
		let tileRow: number = Math.floor(rowId / 3);
		let columnId: number = 0;

		let coord: number = 0;

		// Create sudoku: rows, columns and tiles
		for (coord = 1; coord <= 81; coord++) {

			// Default value to fill the sudoku
			sudoku.squares[coord - 1] = { value: EMPTY_SQUARE_VALUE, status: SquareStatus.Writable };

			// rows
			sudoku.rows[rowId].coords.push(coord - 1);

			// tiles
			if (sudoku.rows[rowId].coords.length <= 3) {
				sudoku.tiles[tileRow * 3].coords.push(coord - 1);
			} else {
				if (sudoku.rows[rowId].coords.length <= 6) {
					sudoku.tiles[tileRow * 3 + 1].coords.push(coord - 1);
				} else {
					if (sudoku.rows[rowId].coords.length <= 9) {
						sudoku.tiles[tileRow * 3 + 2].coords.push(coord - 1);
					}
				}
			}

			// id of current row and row of current tile
			if (coord >= (rowId + 1) * 9) {
				rowId += 1;
				tileRow = Math.floor(rowId / 3);
			}

			// columns
			sudoku.columns[columnId].coords.push(coord - 1);
			if (columnId < 8) {
				columnId++;
			} else {
				columnId = 0;
			}
		}

		return sudoku;
	}
};

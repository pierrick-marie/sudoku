import {Utils, Column, Sudoku, SquareStatus, EMPTY_SQUARE_VALUE} from './Data';

export const Helper = {

	getRandomNumber: (min: number, max: number): number => {
		return Math.floor(Math.random() * max) + min;
	},

	newSudoku: (difficulty: number): Sudoku => {

		let sudoku = Helper.setupEmptySudoku();

		sudoku = Helper.newGame(sudoku);
		sudoku = Helper.hideSquares(difficulty, sudoku);

		return sudoku;
	},

	hideSquares(numberOfSquareToHide: number, sudoku: Sudoku): Sudoku {

		let randomCoord: number = Helper.getRandomNumber(0, 81);
		const hidedSquareList: number[] = [];

		for(let i = 0; i < numberOfSquareToHide; ) {
			if(!hidedSquareList.includes(randomCoord)) {
				sudoku.squares[randomCoord] = { value: EMPTY_SQUARE_VALUE, status: SquareStatus.Writable };
				hidedSquareList.push(randomCoord);
				i++;
			}
			randomCoord = Helper.getRandomNumber(0, 81);
		}

		return sudoku;
	},

	newGame: (sudoku: Sudoku): Sudoku => {

		let coords: number[] = [];

		for (let number = 1; number <= 9; number++) {

			coords = Helper.searchNineAvailableCoords(number, sudoku);

			if (9 != coords.length) {
				number = 0;
				sudoku = Helper.setupEmptySudoku();
			} else {
				coords.forEach((coord) => {
					sudoku.squares[coord].value = number;
					sudoku.squares[coord].status = SquareStatus.Default;
				});
			}
		}

		return sudoku;
	},

	searchNineAvailableCoords: (value: number, sudoku: Sudoku): number[] => {

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
					&& !rowList.includes(Utils.getRowId(coord))
					// square ne correspond pas à une tuile déja prise
					&& !tileList.includes(Utils.getTileId(coord))
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
				randomCoord = possibleCoords[Helper.getRandomNumber(0, possibleCoords.length)];
				coords.push(randomCoord);
				rowList.push(Utils.getRowId(randomCoord));
				tileList.push(Utils.getTileId(randomCoord));
			}
		}

		return coords;
	},

	setupEmptySudoku: (): Sudoku => {

		let sudoku: Sudoku = Utils.newSudoku();

		let rowId: number = 0;
		let tileId: number = Math.floor(rowId / 3);
		let columnId: number = 0;

		let coord: number = 0;

		// Create sudoku: rows, columns and tiles
		for (coord = 0; coord < 9 * 9; coord++) {

			// Rows
			sudoku.rows[rowId].coords.push(coord);

			// Tiles
			if (sudoku.rows[rowId].coords.length <= 3) {
				// Fill first tile
				sudoku.tiles[tileId * 3].coords.push(coord);
			} else {
				if (sudoku.rows[rowId].coords.length <= 6) {
					// Fill second tile
					sudoku.tiles[tileId * 3 + 1].coords.push(coord);
				} else {
					if (sudoku.rows[rowId].coords.length <= 9) {
						// Fill third tile
						sudoku.tiles[tileId * 3 + 2].coords.push(coord);
					}
				}
			}

			// If 9 coords have been saved
			if ((coord + 1) >= (rowId + 1) * 9) {
				// Go to next row
				rowId += 1;
				// Update tile id => go to next line of tile ?
				tileId = Math.floor(rowId / 3);
			}

			// Columns
			sudoku.columns[columnId].coords.push(coord);
			if (columnId < 8) {
				// Go to next column
				columnId++;
			} else {
				// This is the last column, go to the first
				columnId = 0;
			}
		}

		return sudoku;
	}
};

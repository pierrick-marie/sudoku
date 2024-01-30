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

		let board = Utils.createFilledBoard();
		
		board = Utils.hideSquares(difficulty, board);

		return board;
	},

	hideSquares(numberOfSquareToHide: number, board: Board): Board {

		let randomIndex: number = Utils.getRandomNumber(0, 81);
		const hidedSquareList: number[] = [];

		for(let i = 0; i < numberOfSquareToHide; ) {
			if(!hidedSquareList.includes(randomIndex)) {
				board.squares[randomIndex] = { value: EMPTY_SQUARE_VALUE, status: SquareStatus.Writable };
				hidedSquareList.push(randomIndex);
				i++;
			}
			randomIndex = Utils.getRandomNumber(0, 81);
		}

		return board;
	},

	createFilledBoard: (): Board => {

		let board = Utils.createEmptyBoard();

		let coords: number[] = [];

		for (let number = 1; number <= 9; number++) {

			coords = Utils.searchNineCoords(number, board);

			if (9 != coords.length) {
				number = 0;
				board = Utils.createEmptyBoard();
			} else {
				coords.forEach((index) => {
					board = Utils.fillSquare(index, number, board);
				});
			}
		}

		return board;
	},

	searchNineCoords: (value: number, board: Board): number[] => {

		// liste des coords à renvoyer
		const coords: number[] = [];
		// liste des coords blacklistées
		const blackList: number[] = [];
		// Pour chaque coord, la ligne correspondante
		const rowList: number[] = [];
		// Pour chaque coord, la tuile correspondante
		const tileList: number[] = [];
		// Une colonne dans laquelle recherche une coordonnées
		let column: number[] = [];
		// Liste des coords possibles
		let possibleCoords: number[];
		// Index aléatoire
		let randomIndex: number = 0;
		// Maximum try counter
		let nbTry: number = 0;
		// Maximum try 
		const maxTry: number = 81 - 9 * (value - 1);

		while (coords.length < 9 && nbTry < maxTry) {

			nbTry++;

			// Colonne dans laquelle chercher une coord
			column = board.columns[coords.length];

			// Parcours toutes les coords de la colonne
			possibleCoords = column.filter((index) => {
				return (
					// square est vide  
					board.squares[index].value === EMPTY_SQUARE_VALUE
					// square n'est pas blaclisté
					&& !blackList.includes(index)
					// square ne correspond pas à une ligne déja prise
					&& !rowList.includes(Utils.getRowId(index))
					// square ne correspond pas à une tuile déja prise
					&& !tileList.includes(Utils.getTileId(index))
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
				randomIndex = possibleCoords[Utils.getRandomNumber(0, possibleCoords.length)];
				coords.push(randomIndex);
				rowList.push(Utils.getRowId(randomIndex));
				tileList.push(Utils.getTileId(randomIndex));
			}
		}

		return coords;
	},

	fillSquare: (index: number, squareValue: number, board: Board): Board => {

		board.squares[index] = { value: squareValue, status: SquareStatus.Default };

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

import { Tile } from "./Tile";
import { Column } from "./Column";
import { Row } from "./Row";
import { Square, SquareStatus } from "./Square";

export class Sudoku {

	rows: Row[];
	columns: Column[];
	tiles: Tile[];
	squares: Square[];

	constructor() {
		this.rows = [];
		this.columns = [];
		this.tiles = [];
		this.squares = [];

		this.init();
	}

	getRandomNumber (min: number, max: number): number {
		return Math.floor(Math.random() * max) + min;
	}

	init() {
		for(let i = 0; i < 9; i++) {
			this.rows.push(new Row(i));
			this.columns.push(new Column(i));
			this.tiles.push(new Tile(i));
		}

		let rowId: number = 0;
		let tileId: number = Math.floor(rowId / 3);
		let columnId: number = 0;

		let square: Square;

		for(let coord = 0; coord < 9 * 9; coord++) {
			
			square = new Square(coord)
			
			// Square
			this.squares.push(square);

			// Rows
			this.rows[rowId].squares.push(square);

			// Tiles
			if (this.rows[rowId].squares.length <= 3) {
				// Fill first tile
				this.tiles[tileId * 3].squares.push(square);
			} else {
				if (this.rows[rowId].squares.length <= 6) {
					// Fill second tile
					this.tiles[tileId * 3 + 1].squares.push(square);
				} else {
					if (this.rows[rowId].squares.length <= 9) {
						// Fill third tile
						this.tiles[tileId * 3 + 2].squares.push(square);
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
			this.columns[columnId].squares.push(square);
			if (columnId < 8) {
				// Go to next column
				columnId++;
			} else {
				// This is the last column, go to the first
				columnId = 0;
			}
		}
	}

	newGame () {

		let squares: Square[] = [];

		for (let number = 1; number <= 9; number++) {

			squares = this.searchNineAvailableSquare(number);

			if (9 != squares.length) {
				number = 0;
				this.reset();
			} else {
				squares.forEach((square) => {
					square.value = number;
					square.status = SquareStatus.Default;
				});
			}
		}
	}

	reset() {
		this.squares.forEach((square) => {
			square.reset();
		});
	}

	searchNineAvailableSquare (value: number): Square[] {

		// liste des square à renvoyer
		const availableSquares: Square[] = [];
		// liste des square blacklistées
		const blackList: Square[] = [];
		// Pour chaque square, la ligne correspondante
		const rowList: Row[] = [];
		// Pour chaque square, la tuile correspondante
		const tileList: Tile[] = [];
		// Une colonne dans laquelle rechercher un square
		let column: Column;
		// Liste de tous les square possibles
		let possibleSquares: Square[];
		// Square aléatoire
		let randomSquare: Square;
		// Maximum try counter
		let nbTry: number = 0;
		// Maximum try 
		const maxTry: number = 81 - 9 * (value - 1);

		while (availableSquares.length < 9 && nbTry < maxTry) {

			nbTry++;

			// Colonne dans laquelle chercher une coord
			column = this.columns[availableSquares.length];

			// Parcours toutes les coords de la colonne
			possibleSquares = column.squares.filter((currentSquare) => {
				return (
					// square est vide  
					currentSquare.isEmpty()
					// square n'est pas blaclisté
					&& !blackList.includes(currentSquare)
					// square ne correspond pas à une ligne déja prise
					&& !rowList.includes(this.getRowFromSquare(currentSquare))
					// square ne correspond pas à une tuile déja prise
					&& !tileList.includes(this.getTileFromSquare(currentSquare))
				);
			});

			// Pas de coord possible pour les autres colonnes 
			if (0 === possibleSquares.length) {
				// supprime la dernière coord et la place dans la blaclist
				let lastCoord = availableSquares.pop();
				if (lastCoord != undefined) {
					blackList.push(lastCoord);
					rowList.pop();
					tileList.pop();
				}
			} else {
				// Il y a des coord de disponibles
				// Prend une coord au hasar et l'ajoute dans la liste des coords
				randomSquare = possibleSquares[this.getRandomNumber(0, possibleSquares.length)];
				availableSquares.push(randomSquare);
				rowList.push(this.getRowFromSquare(randomSquare));
				tileList.push(this.getTileFromSquare(randomSquare));
			}
		}

		return availableSquares;
	}

	hideSquares(numberOfSquareToHide: number) {

		let randomSquare: Square = this.squares[this.getRandomNumber(0, 81)];
		const hidedSquareList: Square[] = [];

		for(let i = 0; i < numberOfSquareToHide; ) {
			if(!hidedSquareList.includes(randomSquare)) {
				randomSquare.reset();
				hidedSquareList.push(randomSquare);
				i++;
			}
			randomSquare = this.squares[this.getRandomNumber(0, 81)]
		}
	}

	isValid(): boolean {

		return (
			this.allSquareAreFilled() && 
			this.allColumnsAreOk() && 
			this.allRowsAreOk() && 
			this.allTilesAreOk()
		);
	}

	allSquareAreFilled(): boolean {
		
		return this.squares.every((square) => {
			return !square.isEmpty()}
		);
	}

	allTilesAreOk(): boolean {

		return this.tiles.every((tile: Tile) => {
			return tile.isOk();
		});
	}

	allRowsAreOk(): boolean {

		return this.rows.every((row: Row) => {
			return row.isOk();
		});
	}

	allColumnsAreOk(): boolean {

		return this.columns.every((column: Column) => {
			return column.isOk();
		});
	}

	getPossibleValues(square: Square): number[] {

		const defaultValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		const rowValues = this.getRowFromSquare(square).getValues();
		const columnValue = this.getColumnFromSquare(square).getValues();
		const tileValue = this.getTileFromSquare(square).getValues();

		const values = ( defaultValues.filter((element) => !rowValues.includes(element) && 
			!columnValue.includes(element) && 
			!tileValue.includes(element)) );

		return values;
	}

	getRowFromSquare (square: Square): Row {
		return this.rows[Math.trunc(square.coord / 9)];
	}

	getColumnFromSquare (square: Square): Column {
		return this.columns[square.coord % 9];
	}

	getTileFromSquare (square: Square): Tile {
		return this.tiles[Math.trunc(square.coord / (9 * 3)) * 3 + Math.trunc((square.coord % 9) / 3)];
	}
}
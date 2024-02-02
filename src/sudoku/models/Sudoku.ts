import { Tile } from "./Tile";
import { Column } from "./Column";
import { Row } from "./Row";
import { Square } from "./Square";
import { SquareSharp } from "@mui/icons-material";

const DIFFICULTY_EASY: number = 20;
const DIFFICULTY_MEDIUM: number = 30;
const DIFFICULTY_HARD: number = 40;
const DIFFICULTY_VERY_HARD: number = 50;

export class Sudoku {

	public readonly rows: Row[];
	public readonly columns: Column[];
	public readonly tiles: Tile[];
	public squares: Square[];

	public constructor() {
		this.rows = [];
		this.columns = [];
		this.tiles = [];
		this.squares = [];

		for (let i = 0; i < 9; i++) {
			this.rows.push(new Row(i));
			this.columns.push(new Column(i));
			this.tiles.push(new Tile(i));
		}

		this.initSquares();
		this.initRefs();
	}

	/**
	 * Creates a new valid and random game, then hide some squares
	 * @param difficultyLevel the number of square to hide
	 */
	private newGameWithDifficulty(difficultyLevel: number) {

		this.reset();
		// Create a new valid game
		this.newGame();
		// Hide some of squares
		this.hideSquares(difficultyLevel);
	}

	/**
	 * Create a new game in easy mode : 20 squares are hided
	 */
	public newGameEasy() {
		this.newGameWithDifficulty(DIFFICULTY_EASY);
	}

	/**
	 * Create a new game in very medium mode : 30 squares are hided
	 */
	public newGameMedium() {
		this.newGameWithDifficulty(DIFFICULTY_MEDIUM);
	}

	/**
	 * Create a new game in hard mode : 40 squares are hided
	   */
	public newGameHard() {
		this.newGameWithDifficulty(DIFFICULTY_HARD);
	}

	/**
	 * Create a new game in very hard mode : 50 squares are hided
	 */
	public newGameVeryHard() {
		this.newGameWithDifficulty(DIFFICULTY_VERY_HARD);
	}

	/**
	 * Create a game from an array of 81 squares
	 * @param loadedSquares the squares to load
	 */
	public loadGame(loadedSquares: Square[]) {
		
		if (81 === loadedSquares.length) {
			
			this.squares.forEach((square: Square, index: number) => {
				square.load(loadedSquares[index])
			});
		}
	}

	/**
	 * Generate a random number
	 * @param min min value of random number (included)
	 * @param max max value of random number (excluded)
	 * @returns the random number
	 */
	private getRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * max) + min;
	}

	private initSquares() {

		let square: Square;

		for (let coord = 0; coord < 9 * 9; coord++) {

			square = new Square(coord)

			// Square
			this.squares.push(square);
		}
	}

	/**
	 * Setup empty rows, columns, tiles and squares
	 */
	private initRefs() {

		let rowId: number = 0;
		let tileId: number = Math.floor(rowId / 3);
		let columnId: number = 0;

		this.squares.forEach((square, coord) => {

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
		});
	}

	/**
	 * Create a new random and valid game
	 */
	protected newGame() {

		let squares: Square[] = [];

		for (let number = 1; number <= 9; number++) {

			squares = this.searchNineAvailableSquare(number);

			if (9 != squares.length) {
				number = 0;
				this.reset();
			} else {
				squares.forEach((square) => {
					square.defaultValue(number);
				});
			}

			if (9 === number && !this.isValid()) {
				number = 0;
				this.reset();
			}
		}
	}

	/**
	 * Reset all square of the game to default mod.
	 */
	private reset() {
		this.squares.forEach((square) => {
			square.reset();
		});
	}

	/**
	 * Searchs 9 distincts squares (one by row, one by column and one by tile).
	 * @param value value of the square. It is only used to set the maximum number of try 
	 * @returns 9 available squares if possible. Sometimes it is impossible to find 9 distincts squares !
	 */
	private searchNineAvailableSquare(value: number): Square[] {

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

	/**
	 * Choose randomly N squares and set to default state
	 * @param numberOfSquareToHide number of square to reset
	 */
	private hideSquares(numberOfSquareToHide: number) {

		let randomSquare: Square = this.squares[this.getRandomNumber(0, 81)];
		const hidedSquareList: Square[] = [];

		for (let i = 0; i < numberOfSquareToHide;) {
			if (!hidedSquareList.includes(randomSquare)) {
				randomSquare.reset();
				hidedSquareList.push(randomSquare);
				i++;
			}
			randomSquare = this.squares[this.getRandomNumber(0, 81)]
		}
	}

	/**
	 * Verify if all square have a value, and all values are correct
	 * @returns true if the game is valid
	 */
	public isValid(): boolean {

		return (
			this.allSquareAreFilled() &&
			this.allColumnsAreOk() &&
			this.allRowsAreOk() &&
			this.allTilesAreOk()
		);
	}

	/**
	 * Verify whether all squares have a value different from the default value
	 * @returns true if all square have a value
	 */
	private allSquareAreFilled(): boolean {

		return this.squares.every((square) => {
			return !square.isEmpty()
		}
		);
	}

	/**
	 * Verify whether all tilee of the game are valid
	 * @returns true if all tiles are valid
	 */
	private allTilesAreOk(): boolean {

		return this.tiles.every((tile: Tile) => {
			return tile.isOk();
		});
	}

	/**
	 * Verify whether all rows of the game are valid
	 * @returns true if all rows are valid
	 */
	private allRowsAreOk(): boolean {

		return this.rows.every((row: Row) => {
			return row.isOk();
		});
	}

	/**
	 * Verify whether all columns of the game are valid
	 * @returns true if all columns are valid
	 */
	private allColumnsAreOk(): boolean {

		return this.columns.every((column: Column) => {
			return column.isOk();
		});
	}

	/**
	 * Returns the row associated to a square
	 * @param square the square to evaluate
	 * @returns the row of the square
	 */
	private getRowFromSquare(square: Square): Row {
		return this.rows[Math.trunc(square.coord / 9)];
	}

	/**
	 * Return the column associated to a square
	 * @param square the sqaure to evaluate
	 * @returns the column of the square
	 */
	private getColumnFromSquare(square: Square): Column {
		return this.columns[square.coord % 9];
	}

	/**
	 * Returns the tile associated to a square
	 * @param square the square to evaluate
	 * @returns the tile of the square
	 */
	private getTileFromSquare(square: Square): Tile {
		return this.tiles[Math.trunc(square.coord / (9 * 3)) * 3 + Math.trunc((square.coord % 9) / 3)];
	}

	/**
	 * Search all possible value for a square. It check row, column and tile of the square
	 * @param square the sqaure to evaluate
	 * @returns the list of possible value
	 */
	public getPossibleValues(square: Square): number[] {

		const defaultValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		const rowValues = this.getRowFromSquare(square).getValues();
		const columnValue = this.getColumnFromSquare(square).getValues();
		const tileValue = this.getTileFromSquare(square).getValues();

		const values = (defaultValues.filter((element) => !rowValues.includes(element) &&
			!columnValue.includes(element) &&
			!tileValue.includes(element)));

		return values;
	}
}
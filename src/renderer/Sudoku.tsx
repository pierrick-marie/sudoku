'use client';

import { useState } from 'react';

import styles from './sudoku.module.scss';

const EMPTY_SQUARE_VALUE = -1;

enum SquareStatus {
	Default,	// User can not change its value
	Writable,	// user can change its value (empty when game start) 
	Filled,	// User has changed its value (may be ok, or not ;)
}

interface Square {
	value: number;
	status: SquareStatus;
}

interface Board {
	rows: number[][];
	tiles: number[][];
	columns: number[][];
	squares: Square[];
}

export default function Sudoku() {

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

	let rowId = 0;
	let tileRow = Math.floor(rowId / 3);
	let columnId = 0;
	let rand = 0;

	for (let id = 1; id <= 9 * 9; id++) {

		rand = Math.floor(Math.random() * 9);

		board.squares.push(rand === 0 ? {value: EMPTY_SQUARE_VALUE, status: SquareStatus.Writable} : {value: rand, status: SquareStatus.Default});

		// rows
		board.rows[rowId].push(id - 1);

		// tiles
		if (board.rows[rowId].length <= 3) {
			board.tiles[tileRow * 3].push(id - 1);
		} else {
			if (board.rows[rowId].length <= 6) {
				board.tiles[tileRow * 3 + 1].push(id - 1);
			} else {
				if (board.rows[rowId].length <= 9) {
					board.tiles[tileRow * 3 + 2].push(id - 1);
				}
			}
		}

		if (id >= (rowId + 1) * 9) {
			rowId += 1;
			tileRow = Math.floor(rowId / 3);
		}

		// columns
		board.columns[columnId].push(id - 1);
		if (columnId < 8) {
			columnId++;
		} else {
			columnId = 0;
		}
	}

	return (
		<Game {...board}/>
	)
	
}

function getRowNumber(id: number): number {
	return Math.trunc(id / 9);
}

function getColumnNumber(id: number): number {	
	return id % 9;
}

function getTileNumber(id: number): number {	
	return Math.trunc(id / (9 * 3)) * 3 + Math.trunc((id % 9) / 3);
}

function getRowValues(idRow: number, board: Board): number[] {
	const values: number[] = [];

	board.rows[idRow].forEach((element) => {
		values.push(board.squares[element].value);
	});

	return values;
}

function getColumnValues(idColumn: number, board: Board): number[] {
	const values: number[] = [];

	board.columns[idColumn].forEach((element) => {
		values.push(board.squares[element].value);
	});

	return values;
}

function getTileValues(idTile: number, board: Board): number[] {
	const values: number[] = [];

	board.tiles[idTile].forEach((element) => {
		values.push(board.squares[element].value);
	});

	return values;
}

function availableValues(id: number, board: Board): number[] {

	const defaults = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	const row =  getRowValues(getRowNumber(id), board);
	const column = getColumnValues(getColumnNumber(id), board);
	const tile = getTileValues(getTileNumber(id), board);
	
	const values = defaults.filter((element) => !row.includes(element) && !column.includes(element) && !tile.includes(element));

	return values;
}

function Game(board: Board) {

	const [displayPopup, setDisplayPopup] = useState<boolean>(false);
	const [selectedSquare, setSelectedSquare] = useState<number>(-1);
	const [popupData, setPopupData] = useState<any>({message: '', x: 0, y: 0});

	const handleSquareClicked = (id: number, x: number, y: number) => {
		
		let values = availableValues(id, board);
		
		setDisplayPopup(true);
		setPopupData({x, y, values})
		setSelectedSquare(id);
	};

	const handlePopupClicked = () => {

		setDisplayPopup(false);
	}

	const handlePopupValueClicked = (value: number) => {

		if(EMPTY_SQUARE_VALUE === value) {
			board.squares[selectedSquare].status = SquareStatus.Writable;	
		} else {
			board.squares[selectedSquare].status = SquareStatus.Filled;
		}

		board.squares[selectedSquare].value = value;
		setDisplayPopup(false);
	}

	return (
		<div
			className={styles.game}
			// onClick={handleGameClicked} 
		>

			{displayPopup && (<Popup handlePopupClick={handlePopupClicked} handleValueClick={handlePopupValueClicked} data={popupData} />)}

			<Board rows={board.rows} squares={board.squares} handleSquareClick={handleSquareClicked} />

			<div className={styles.control}>

				<button className={styles.cancel}
				// onClick={cancelLastMove}
				>
					Cancel
				</button>

				<button className={styles.cancel}
				// onClick={handleNewGame}
				>
					New game!
				</button>

				<ol className={styles.history}>
					{/* {lastMoves()} */}
				</ol>
			</div>
		</div>
	)
}


interface PopupProp {
	data: {
		x: number;
		y: number;
		values: number[];
	}
	handlePopupClick: any;
	handleValueClick: any;
}

function Popup({data, handlePopupClick, handleValueClick}: PopupProp) {

	return (
		<div className={styles.popup}
			onClick={handlePopupClick}
			style={{
				display: 'flex',
				top: `${data.y + 10}px`,
				left: `${data.x + 10}px`, // Ajoutez un décalage pour le placer à côté de l'élément
			}}
		>
			{data.values.map((value: number, index) => {
				return ( 
					<p onClick={() => {handleValueClick(value)}} key={index}>
						{value}
					</p>
				)
			})}
			<p onClick={() => {handleValueClick(EMPTY_SQUARE_VALUE)}}>✖</p>
		</div>
	)
}

interface BoardProps {
	rows: number[][];
	squares: Square[];
	handleSquareClick: any;
}

function Board({ rows, squares, handleSquareClick }: BoardProps) {

	let counter = 0;

	return (
		<div>
			<div className={styles.board}>
				{rows.map((row: number[], index) => {
					if (counter >= 3) {
						counter = 0;
					}
					counter++;
					return <Row
						ids={row}
						squares={squares}
						topBorder={counter == 1}
						bottomBorder={counter == 3}
						handleSquareClick={handleSquareClick}
						key={index} />
				})}
			</div>
		</div>
	)
}

interface RowProps {
	ids: number[];
	squares: Square[];
	topBorder: boolean;
	bottomBorder: boolean;
	handleSquareClick: any;

}

function Row({ ids, squares, topBorder, bottomBorder, handleSquareClick }: RowProps) {

	let counter = 0;

	return (
		<div className={styles.row}>
			{ids.map((id: number) => {
				if (counter >= 3) {
					counter = 0;
				}
				counter++;
				return (
					<Square
						id={id}
						square={squares[id]}
						leftBorder={counter == 1}
						rightBorder={counter == 3}
						topBorder={topBorder}
						bottomBorder={bottomBorder}
						onSquareClick={handleSquareClick}
						key={id} />
				)
			})}
		</div>
	)
}



interface SquareProps {
	id: number;
	square: Square;
	leftBorder: boolean;
	rightBorder: boolean;
	topBorder: boolean;
	bottomBorder: boolean;
	onSquareClick: any;
}

function Square({ id, square, leftBorder, rightBorder, topBorder, bottomBorder, onSquareClick }: SquareProps) {

	return (
		<div
			onClick={(event) => {if(square.status != SquareStatus.Default) {onSquareClick(id, event.clientX, event.clientY)}}}
			className={`
				${styles.square} 
				${topBorder ? styles.borderTop : ''}
				${bottomBorder ? styles.borderBottom : ''}
				${rightBorder ? styles.borderRight : ''}
				${leftBorder ? styles.borderLeft : ''}
				${square.status === SquareStatus.Default ? styles.default : 
					square.status === SquareStatus.Writable ? styles.writable : 
					styles.filled}
			`}
		>
			<div className={styles.value}>{square.value === EMPTY_SQUARE_VALUE ? '' : square.value}</div>
		</div>
	)
}

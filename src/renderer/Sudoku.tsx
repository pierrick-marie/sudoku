'use client';

import { useState, useEffect } from 'react';

import styles from './sudoku.module.scss';

interface GameProps {
	rows: number[][];
	tiles: number[][];
	columns: number[][];
	values: number[];
}

export default function Sudoku() {

	const gameProps: GameProps = {
		rows: [],
		tiles: [],
		columns: [],
		values: [],
	};

	// Setup sub arrays
	let row: number[] = [];
	let tile: number[] = [];
	let column: number[] = [];

	for (let i = 0; i < 9; i++) {
		gameProps.rows.push(row);
		row = [];
		gameProps.tiles.push(tile);
		tile = [];
		gameProps.columns.push(column);
		column = [];
	}

	let rowId = 0;
	let tileRow = Math.floor(rowId / 3);
	let columnId = 0;
	let rand = 0;

	for (let id = 1; id <= 9 * 9; id++) {

		rand = Math.floor(Math.random() * 9) + 1

		gameProps.values.push(rand);

		// rows
		gameProps.rows[rowId].push(id - 1);

		// tiles
		if (gameProps.rows[rowId].length <= 3) {
			gameProps.tiles[tileRow * 3].push(id - 1);
		} else {
			if (gameProps.rows[rowId].length <= 6) {
				gameProps.tiles[tileRow * 3 + 1].push(id - 1);
			} else {
				if (gameProps.rows[rowId].length <= 9) {
					gameProps.tiles[tileRow * 3 + 2].push(id - 1);
				}
			}
		}

		if (id >= (rowId + 1) * 9) {
			rowId += 1;
			tileRow = Math.floor(rowId / 3);
		}

		// columns
		gameProps.columns[columnId].push(id - 1);
		if (columnId < 8) {
			columnId++;
		} else {
			columnId = 0;
		}
	}

	return (
		<Game {...gameProps}/>
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

function getRowValues(idRow: number, gameProps: GameProps): number[] {
	const values: number[] = [];

	gameProps.rows[idRow].forEach((element) => {
		values.push(gameProps.values[element]);
	});

	return values;
}

function getColumnValues(idColumn: number, gameProps: GameProps): number[] {
	const values: number[] = [];

	gameProps.columns[idColumn].forEach((element) => {
		values.push(gameProps.values[element]);
	});

	return values;
}

function getTileValues(idTile: number, gameProps: GameProps): number[] {
	const values: number[] = [];

	gameProps.tiles[idTile].forEach((element) => {
		values.push(gameProps.values[element]);
	});

	return values;
}

function availableValues(id: number, gameProps: GameProps): number[] {

	const defaults = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	const row =  getRowValues(getRowNumber(id), gameProps);
	const column = getColumnValues(getColumnNumber(id), gameProps);
	const tile = getTileValues(getTileNumber(id), gameProps);
	
	const values = defaults.filter((element) => !row.includes(element) && !column.includes(element) && !tile.includes(element));

	return values;
}

function Game(gameProps: GameProps) {

	const [displayPopup, setDisplayPopup] = useState<boolean>(false);
	const [selectedSquare, setSelectedSquare] = useState<number>(-1);
	const [popupData, setPopupData] = useState<any>({message: '', x: 0, y: 0});

	const handleSquareClicked = (id: number, x: number, y: number) => {
		
		let values = availableValues(id, gameProps);
		
		setDisplayPopup(values.length > 0);
		setPopupData({x, y, values})
		setSelectedSquare(id);
	};

	const handlePopupClicked = () => {
		setDisplayPopup(false);
	}

	const handlePopupValueClicked = (value: number) => {
		gameProps.values[selectedSquare] = value;
		setDisplayPopup(false);
	}

	return (
		<div
			className={styles.game}
			// onClick={handleGameClicked} 
		>

			{displayPopup && (<Popup handlePopupClick={handlePopupClicked} handleValueClick={handlePopupValueClicked} data={popupData} />)}

			<Board rows={gameProps.rows} values={gameProps.values} handleSquareClick={handleSquareClicked} />

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
	handlePopupClick: any;
	handleValueClick: any;
	data: {
		x: number;
		y: number;
		values: number[];
	}
}

function Popup({handlePopupClick, handleValueClick, data}: PopupProp) {

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
		</div>
	)
}

interface BoardProps {
	rows: number[][];
	values: number[];
	handleSquareClick: any;
}

function Board({ rows, values, handleSquareClick }: BoardProps) {

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
						values={values}
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
	values: number[];
	topBorder: boolean;
	bottomBorder: boolean;
	handleSquareClick: any;

}

function Row({ ids, values, topBorder, bottomBorder, handleSquareClick }: RowProps) {

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
						value={values[id]}
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
	value: number;
	leftBorder: boolean;
	rightBorder: boolean;
	topBorder: boolean;
	bottomBorder: boolean;
	onSquareClick: any;
}

function Square({ id, value, leftBorder, rightBorder, topBorder, bottomBorder, onSquareClick }: SquareProps) {

	return (
		<div
			onClick={(event) => onSquareClick(id, event.clientX, event.clientY)}
			className={`${styles.square} 
			${topBorder ? styles.borderTop : ''}
			${bottomBorder ? styles.borderBottom : ''}
			${rightBorder ? styles.borderRight : ''}
			${leftBorder ? styles.borderLeft : ''}`}
		>
			<p>{value}</p>
		</div>
	)
}

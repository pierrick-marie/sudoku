'use client';

import { useState, useEffect } from 'react';

import styles from './sudoku.module.scss';
// import './sudoku.module.scss';

function changeValue(coord: number, value: number, board: number[]): number[] {

	return board;
}

export default function Sudoku() {

	const rows: number[][] = [];
	const tiles: number[][] = [];
	const columns: number[][] = [];
	const values: number[] = [];

	// Setup sub arrays
	let row: number[] = [];
	let tile: number[] = [];
	let column: number[] = [];

	for (let i = 0; i < 9; i++) {
		rows.push(row);
		row = [];
		tiles.push(tile);
		tile = [];
		columns.push(column);
		column = [];
	}

	let rowId = 0;
	let tileRow = Math.floor(rowId / 3);
	let columnId = 0;

	for (let coord = 1; coord <= 9 * 9; coord++) {
		values.push(coord);

		// rows
		rows[rowId].push(coord - 1);

		// tiles
		if (rows[rowId].length <= 3) {
			tiles[tileRow * 3].push(coord - 1);
		} else {
			if (rows[rowId].length <= 6) {
				tiles[tileRow * 3 + 1].push(coord - 1);
			} else {
				if (rows[rowId].length <= 9) {
					tiles[tileRow * 3 + 2].push(coord - 1);
				}
			}
		}

		if (coord >= (rowId + 1) * 9) {
			rowId += 1;
			tileRow = Math.floor(rowId / 3);
		}

		// columns
		columns[columnId].push(coord - 1);
		if (columnId < 8) {
			columnId++;
		} else {
			columnId = 0;
		}
	}

	// const [board, setBoard] = useState<BoardData>(boardData);

	let count = 0;

	return (
		<div className={styles.game}>

			<Board rows={rows} values={values} />

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


interface BoardProps {
	rows: number[][];
	values: number[];
}

function Board({ rows, values }: BoardProps) {

	let counter = 0;

	return (
		<div className={styles.board}>
			{rows.map((row: number[], index) => {
				if (counter >= 3) {
					counter = 0;
				}
				counter++;
				return <Row 
					coords={row} 
					values={values} 
					topBorder={counter == 1}
					bottomBorder={counter == 3}
					key={index} />
			})}
		</div>
	)
}

interface RowProps {
	coords: number[];
	values: number[];
	topBorder: boolean;
	bottomBorder: boolean;
	
}

function Row({ coords, values, topBorder, bottomBorder }: RowProps) {

	let counter = 0;

	return (
		<div className={styles.row}>
			{coords.map((coord: number) => {
				if (counter >= 3) {
					counter = 0;
				}
				counter++;
				return (
					<Square 
						value={values[coord]}
						leftBorder={counter == 1}
						rightBorder={counter == 3} 
						topBorder={topBorder}
						bottomBorder={bottomBorder}
						key={values[coord]} />
				)
			})}
		</div>
	)
}

interface SquareProps {
	value: number;
	leftBorder: boolean;
	rightBorder: boolean;
	topBorder: boolean;
	bottomBorder: boolean;
}

function Square({ value, leftBorder, rightBorder, topBorder, bottomBorder }: SquareProps) {

	console.log(leftBorder);

	return (
		<div className={`${styles.square} 
			${topBorder ? styles.borderTop : ''}
			${bottomBorder ? styles.borderBottom : ''}
			${rightBorder ? styles.borderRight : ''}
			${leftBorder ? styles.borderLeft : ''}`}>
			<p>{value}</p>
		</div>
	)
}

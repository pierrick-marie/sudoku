'use client';

import { useState, useEffect } from 'react';

import styles from './sudoku.module.scss';

function changeValue(coord: number, value: number, board: number[]): number[] {

	return board;
}

interface BoardData {
	lines: number[][];
	tiles: number[][];
	columns: number[][];
	values: number[];
}

export default function Sudoku() {

	const boardData: BoardData = {
		lines: [],
		tiles: [],
		columns: [],
		values: [],
	};

	// Setup sub arrays
	let line: number[] = [];
	let tile: number[] = [];
	let column: number[] = [];

	for (let i = 0; i < 9; i++) {
		boardData.lines.push(line);
		line = [];
		boardData.tiles.push(tile);
		tile = [];
		boardData.columns.push(column);
		column = [];
	}

	let lineId = 0;
	let tileLine = Math.floor(lineId / 3);
	let columnId = 0;

	for (let coord = 1; coord <= 9 * 9; coord++) {
		boardData.values.push(coord);

		// lines
		boardData.lines[lineId].push(coord - 1);

		// tiles
		if (boardData.lines[lineId].length <= 3) {
			boardData.tiles[tileLine * 3].push(coord - 1);
		} else {
			if (boardData.lines[lineId].length <= 6) {
				boardData.tiles[tileLine * 3 + 1].push(coord - 1);
			} else {
				if (boardData.lines[lineId].length <= 9) {
					boardData.tiles[tileLine * 3 + 2].push(coord - 1);
				}
			}
		}

		if (coord >= (lineId + 1) * 9) {
			lineId += 1;
			tileLine = Math.floor(lineId / 3);
		}

		// columns
		boardData.columns[columnId].push(coord - 1);
		if (columnId < 8) {
			columnId++;
		} else {
			columnId = 0;
		}
	}

	const [board, setBoard] = useState<BoardData>(boardData);

	let count = 0;

	return (
		<div className={styles.game}>

			<Board {...board} />

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

function Board({ lines, tiles, columns, values }: BoardData) {

	return (
		<div className={styles.board}>
			{lines}
		</div>
	)
}

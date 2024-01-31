'use client';

import { useState } from 'react';

import styles from './sudoku.module.scss';

import {Sudoku, Row, Column, Tile, SudokuData, SquareStatus, SquareData, EMPTY_SQUARE_VALUE} from './utils/CreateSudoku';

const DIFFICULTY: number = 20;

export default function Root() {

	const [board, setBoard] = useState<SudokuData>(Sudoku.newSudoku(DIFFICULTY));
	const [displayPopup, setDisplayPopup] = useState<boolean>(false);
	const [selectedSquare, setSelectedSquare] = useState<number>(-1);
	const [popupData, setPopupData] = useState<any>({message: '', x: 0, y: 0});

	const handleNewGame = () => {
		setBoard(Sudoku.newSudoku(DIFFICULTY));
	}

	const handleSquareClicked = (id: number, x: number, y: number) => {
		
		let values = Sudoku.getPossibleValues(id, board);
		
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
	}

	return (
		<div
			className={styles.game}
			// onClick={handleGameClicked} 
		>

			{displayPopup && (<Popup handlePopupClick={handlePopupClicked} handleValueClick={handlePopupValueClicked} data={popupData} />)}

			<Board rows={board.rows} squares={board.squares} handleSquareClick={handleSquareClicked} />

			<div className={styles.control}>

				{/* <button className={styles.cancel}
				// onClick={cancelLastMove}
				>
					Cancel
				</button> */}

				<button className={styles.cancel} onClick={handleNewGame} >
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
			<p className={styles.cancel} onClick={() => {handleValueClick(EMPTY_SQUARE_VALUE)}}>x</p>
		</div>
	)
}

interface BoardProps {
	rows: Row[];
	squares: SquareData[];
	handleSquareClick: any;
}

function Board({ rows, squares, handleSquareClick }: BoardProps) {

	let counter = 0;

	return (
		<div>
			<div className={styles.board}>
				{rows.map((myRow: Row, index) => {
					if (counter >= 3) {
						counter = 0;
					}
					counter++;
					return <Row
						row={myRow}
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
	row: Row;
	squares: SquareData[];
	topBorder: boolean;
	bottomBorder: boolean;
	handleSquareClick: any;

}

function Row({ row, squares, topBorder, bottomBorder, handleSquareClick }: RowProps) {

	let counter = 0;

	return (
		<div className={styles.row}>
			{row.coords.map((myCoord: number) => {
				if (counter >= 3) {
					counter = 0;
				}
				counter++;
				return (
					<Square
						coord={myCoord}
						square={squares[myCoord]}
						leftBorder={counter == 1}
						rightBorder={counter == 3}
						topBorder={topBorder}
						bottomBorder={bottomBorder}
						onSquareClick={handleSquareClick}
						key={myCoord} />
				)
			})}
		</div>
	)
}



interface SquareProps {
	coord: number;
	square: SquareData;
	leftBorder: boolean;
	rightBorder: boolean;
	topBorder: boolean;
	bottomBorder: boolean;
	onSquareClick: any;
}

function Square({ coord, square, leftBorder, rightBorder, topBorder, bottomBorder, onSquareClick }: SquareProps) {

	return (
		<div
			onClick={(event) => {if(square.status != SquareStatus.Default) {onSquareClick(coord, event.clientX, event.clientY)}}}
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

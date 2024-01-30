'use client';

import { useState } from 'react';

import styles from './sudoku.module.scss';

import {Utils, Board, SquareStatus, Square, EMPTY_SQUARE_VALUE} from './Utils';

const DIFFICULTY: number = 60;

export default function Sudoku() {

	const [board, setBoard] = useState<Board>(Utils.newBoard(DIFFICULTY));
	const [displayPopup, setDisplayPopup] = useState<boolean>(false);
	const [selectedSquare, setSelectedSquare] = useState<number>(-1);
	const [popupData, setPopupData] = useState<any>({message: '', x: 0, y: 0});

	const handleNewGame = () => {
		setBoard(Utils.newBoard(DIFFICULTY));
	}

	const handleSquareClicked = (id: number, x: number, y: number) => {
		
		let values = Utils.getPossibleValues(id, board);
		
		console.log(`required values : ${Utils.getRequiredValues(id, board)}`);

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

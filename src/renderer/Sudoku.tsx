'use client';

import { useState } from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';

import styles from './sudoku.module.scss';

import { Utils, Row, SudokuData, SquareStatus, SquareData, EMPTY_SQUARE_VALUE } from './utils/Data';
import { Sudoku } from './utils/CreateSudoku';
import { Resolv } from './utils/ResolvSudoku';

const DIFFICULTY_EASY: number = 20;
const DIFFICULTY_MEDIUM: number = 30;
const DIFFICULTY_HARD: number = 40;
const DIFFICULTY_VERY_HARD: number = 50;

export default function Root() {

	const [displayPopup, setDisplayPopup] = useState<boolean>(false);
	const [difficultyLevel, setDifficultyLevel] = useState<number>(DIFFICULTY_EASY);
	const [youWin, setYouWin] = useState<boolean>(false);
	const [selectedSquare, setSelectedSquare] = useState<number>(-1);
	const [popupData, setPopupData] = useState<any>({ message: '', x: 0, y: 0 });
	const [board, setBoard] = useState<SudokuData>(Sudoku.newSudoku(difficultyLevel));

	const handleNewGame = () => {

		setYouWin(false);

		setBoard(Sudoku.newSudoku(difficultyLevel));
	}

	const handleDifficultyChanged = (event: SelectChangeEvent) => {
		setDifficultyLevel(+event.target.value);
	}

	const handleSquareClicked = (id: number, x: number, y: number) => {

		if (!youWin) {

			let values = Utils.getPossibleValues(id, board);

			setDisplayPopup(true);
			setPopupData({ x, y, values })
			setSelectedSquare(id);
		}
	}

	const handlePopupClicked = () => {
		setDisplayPopup(false);
	}

	const handlePopupValueClicked = (value: number) => {

		if (EMPTY_SQUARE_VALUE === value) {
			board.squares[selectedSquare].status = SquareStatus.Writable;
		} else {
			board.squares[selectedSquare].status = SquareStatus.Filled;
		}

		board.squares[selectedSquare].value = value;

		if (Resolv.isValid(board)) {
			setYouWin(true);
		}
	}

	return (
		<div className={styles.game} >

			{displayPopup && (<Popup handlePopupClick={handlePopupClicked} handleValueClick={handlePopupValueClicked} data={popupData} />)}

			{youWin && (<YouWin />)}

			<Board rows={board.rows} squares={board.squares} handleSquareClick={handleSquareClicked} />

			<div className={styles.control}>

				<DifficultyLevel difficulty={difficultyLevel} handleDifficultyChange={handleDifficultyChanged} />

				<Button sx={{ m: 1, minWidth: 120 }} variant='outlined' endIcon={<SendIcon />} onClick={handleNewGame} >
					New game!
				</Button>

			</div>
		</div>
	)
}

interface DifficultyProp {
	difficulty: number;
	handleDifficultyChange: any;
}

function DifficultyLevel({difficulty, handleDifficultyChange}: DifficultyProp) {

	return (
		<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
			<InputLabel id="difficulty-select-label">Difficulté</InputLabel>
			<Select
				labelId="difficulty-select-label"
				id="difficulty-select"
				value={difficulty}
				label="Diffilté"
				onChange={handleDifficultyChange}
			>
				<MenuItem value={DIFFICULTY_EASY}>Facile</MenuItem>
				<MenuItem value={DIFFICULTY_MEDIUM}>Moyen</MenuItem>
				<MenuItem value={DIFFICULTY_HARD}>Difficile</MenuItem>
				<MenuItem value={DIFFICULTY_VERY_HARD}>Très difficile</MenuItem>
			</Select>
		</FormControl>
	)
}

function YouWin() {

	return (
		<div className={styles.youWin}>
			<p>You Win!</p>
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

function Popup({ data, handlePopupClick, handleValueClick }: PopupProp) {

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
					<p onClick={() => { handleValueClick(value) }} key={index}>
						{value}
					</p>
				)
			})}
			<p className={styles.cancel} onClick={() => { handleValueClick(EMPTY_SQUARE_VALUE) }}>x</p>
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
			onClick={(event) => { if (square.status != SquareStatus.Default) { onSquareClick(coord, event.clientX, event.clientY) } }}
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

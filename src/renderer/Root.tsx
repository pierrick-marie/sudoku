'use client';

import { useState } from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import styles from './sudoku.module.scss';

import { Sudoku } from '../sudoku/models/Sudoku';
import { Square } from '../sudoku/models/Square';
import { Row } from '../sudoku/models/Row';

const DIFFICULTY_EASY: number = 1;
const DIFFICULTY_MEDIUM: number = 2;
const DIFFICULTY_HARD: number = 3;
const DIFFICULTY_VERY_HARD: number = 4;
const DEFAULT_VALUE: number = -1;

interface PopupData {
	x: number;
	y: number;
	values: number[];
}

interface PopupProp {
	data: PopupData;
	handlePopupClick: any;
	handleValueClick: any;
}


export default function Root() {

	const [displayPopup, setDisplayPopup] = useState<boolean>(false);
	const [difficultyLevel, setDifficultyLevel] = useState<number>(DIFFICULTY_EASY);
	const [youWin, setYouWin] = useState<boolean>(false);
	const [selectedSquare, setSelectedSquare] = useState<Square>(new Square(DEFAULT_VALUE));
	const [popupData, setPopupData] = useState<PopupData>({ values: [], x: 0, y: 0 });
	const [sudoku, setSudoku] = useState<Sudoku>(new Sudoku());

	const changeDifficulty = (): Sudoku => {
		switch(difficultyLevel) {
			case DIFFICULTY_EASY: {
				sudoku.newGameEasy();
			}
			case DIFFICULTY_MEDIUM: {
				sudoku.newGameMedium();
			}
			case DIFFICULTY_HARD: {
				sudoku.newGameHard();
			}
			case DIFFICULTY_VERY_HARD: {
				sudoku.newGameVeryHard();
			}
		}

		return sudoku;
	}
	changeDifficulty();


	const handleSaveGame = async () => {

		// window.electron.ipcRenderer.setTitle('Coucou :)');

		// const res = await window.electron.ipcRenderer.getTitle();

		// console.log(`Result from invoke : ${res}`);

		// window.electron.ipcRenderer.newTitle((title: string) => {
		// 	console.log(`New title = ${title}`);
		// })

		/**
 		// @boiler-plate-backup
		// calling IPC exposed from preload script
		window.electron.ipcRenderer.once('save-sudoku', (arg) => {
			// eslint-disable-next-line no-console
			console.log(arg);
		});

		window.electron.ipcRenderer.sendMessage('save-sudoku', [sudoku]);
		**/
	}

	const handleNewGame = () => {

		setYouWin(false);

		setSudoku(changeDifficulty());
	}

	const handleDifficultyChanged = (event: SelectChangeEvent) => {
		setDifficultyLevel(+event.target.value);
	}

	const handleSquareClicked = (square: Square, x: number, y: number) => {

		if (!youWin) {

			let values = sudoku.getPossibleValues(square);

			setDisplayPopup(true);
			setPopupData({ x, y, values })
			setSelectedSquare(square);
		}
	}

	const handlePopupClicked = () => {
		setDisplayPopup(false);
	}

	const handlePopupValueClicked = (value: number) => {

		if (EMPTY_SQUARE_VALUE === value) {
			sudoku.squares[selectedSquare].status = SquareStatus.Writable;
		} else {
			sudoku.squares[selectedSquare].status = SquareStatus.Filled;
		}

		sudoku.squares[selectedSquare].value = value;

		if (Resolv.isValid(sudoku)) {
			setYouWin(true);
		}
	}

	return (
		<div className={styles.game} >

			{displayPopup && (<Popup handlePopupClick={handlePopupClicked} handleValueClick={handlePopupValueClicked} data={popupData} />)}

			{youWin && (<YouWin />)}

			<Board rows={sudoku.rows} squares={sudoku.squares} handleSquareClick={handleSquareClicked} />

			<div className={styles.control}>

				<DifficultyLevel difficulty={difficultyLevel} handleDifficultyChange={handleDifficultyChanged} />

				<Button sx={{ m: 1, minWidth: 120 }} variant='outlined' onClick={handleNewGame} >
					Nouveau
				</Button>

				<Button sx={{ m: 1, minWidth: 120 }} variant='outlined' color='secondary' onClick={handleSaveGame} >
					Enregistrer
				</Button>

			</div>
		</div>
	)
}

interface DifficultyProp {
	difficulty: number;
	handleDifficultyChange: any;
}

function DifficultyLevel({ difficulty, handleDifficultyChange }: DifficultyProp) {

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
	squares: Square[];
	handleSquareClick: any;
}

function Board({ rows, squares, handleSquareClick }: BoardProps) {

	let counter = 0;

	return (
		<div>
			<div className={styles.board}>
				{rows.map((myRow: RowElement, index) => {
					if (counter >= 3) {
						counter = 0;
					}
					counter++;
					return <RowElement
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
	squares: Square[];
	topBorder: boolean;
	bottomBorder: boolean;
	handleSquareClick: any;

}

function RowElement({ row, squares, topBorder, bottomBorder, handleSquareClick }: RowProps) {

	let counter = 0;

	return (
		<div className={styles.row}>
			{row.coords.map((myCoord: number) => {
				if (counter >= 3) {
					counter = 0;
				}
				counter++;
				return (
					<SquareElement
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
	square: Square;
	leftBorder: boolean;
	rightBorder: boolean;
	topBorder: boolean;
	bottomBorder: boolean;
	onSquareClick: any;
}

function SquareElement({ coord, square, leftBorder, rightBorder, topBorder, bottomBorder, onSquareClick }: SquareProps) {

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

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

const DEFAULT_VALUE: number = -1;

enum Difficulty {
	Easy,
	Medium,
	Hard,
	Very_Hard,
}

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

interface DifficultyProp {
	difficulty: Difficulty;
	handleDifficultyChange: any;
}

interface BoardProps {
	sudoku: Sudoku;
	handleSquareClick: any;
}

interface RowProps {
	row: Row;
	topBorder: boolean;
	bottomBorder: boolean;
	handleSquareClick: any;

}

interface SquareProps {
	square: Square;
	leftBorder: boolean;
	rightBorder: boolean;
	topBorder: boolean;
	bottomBorder: boolean;
	onSquareClick: any;
}

export default function Root() {

	const newGame = (difficulty: Difficulty): Sudoku => {
		
		const mySudoku: Sudoku = new Sudoku();

		switch (difficulty) {
			case Difficulty.Easy: {
				mySudoku.newGameEasy();
				break;
			}
			case Difficulty.Medium: {
				mySudoku.newGameMedium();
				break;
			}
			case Difficulty.Hard: {
				mySudoku.newGameHard();
				break;
			}
			case Difficulty.Very_Hard: {
				mySudoku.newGameVeryHard();
				break;
			}
		}

		return mySudoku;
	}

	const [displayPopup, setDisplayPopup] = useState<boolean>(false);
	const [difficultyLevel, setDifficultyLevel] = useState<Difficulty>(Difficulty.Easy);
	const [youWin, setYouWin] = useState<boolean>(false);
	const [selectedSquare, setSelectedSquare] = useState<Square>(new Square(DEFAULT_VALUE));
	const [popupData, setPopupData] = useState<PopupData>({ values: [], x: 0, y: 0 });
	const [sudoku, setSudoku] = useState<Sudoku>(newGame(difficultyLevel));

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
		setSudoku(newGame(difficultyLevel));
	}

	const handleDifficultyChanged = (event: SelectChangeEvent) => {
		
		setDifficultyLevel(+event.target.value);
		setSudoku(newGame(+event.target.value));
	}

	const handleSquareClicked = (square: Square, x: number, y: number) => {

		if (!youWin) {

			let values = sudoku.getPossibleValues(square);

			setPopupData({ x, y, values })
			setSelectedSquare(square);
			setDisplayPopup(true);
		}
	}

	const handlePopupClicked = () => {
		setDisplayPopup(false);
	}

	const handlePopupValueClicked = (value: number) => {

		if (DEFAULT_VALUE === value) {
			selectedSquare.reset();
		} else {
			selectedSquare.setValue(value);

			if (sudoku.isValid()) {
				setYouWin(true);
			}
		}
	}

	return (
		<div className={styles.game} >

			{displayPopup && (<Popup handlePopupClick={handlePopupClicked} handleValueClick={handlePopupValueClicked} data={popupData} />)}

			{youWin && (<YouWin />)}

			<Board sudoku={sudoku} handleSquareClick={handleSquareClicked} />

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
				<MenuItem value={Difficulty.Easy}>Facile</MenuItem>
				<MenuItem value={Difficulty.Medium}>Moyen</MenuItem>
				<MenuItem value={Difficulty.Hard}>Difficile</MenuItem>
				<MenuItem value={Difficulty.Very_Hard}>Très difficile</MenuItem>
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
			<p className={styles.cancel} onClick={() => { handleValueClick(DEFAULT_VALUE) }}>x</p>
		</div>
	)
}

function Board({ sudoku, handleSquareClick }: BoardProps) {

	let counter = 0;

	return (
		<div>
			<div className={styles.board}>
				{sudoku.rows.map((myRow: Row, index: number) => {
					if (counter >= 3) {
						counter = 0;
					}
					counter++;
					return <RowElement
						row={myRow}
						topBorder={counter == 1}
						bottomBorder={counter == 3}
						handleSquareClick={handleSquareClick}
						key={index} />
				})}
			</div>
		</div>
	)
}



function RowElement({ row, topBorder, bottomBorder, handleSquareClick }: RowProps) {

	let counter = 0;

	return (
		<div className={styles.row}>
			{row.squares.map((mySquare: Square) => {
				if (counter >= 3) {
					counter = 0;
				}
				counter++;
				return (
					<SquareElement
						square={mySquare}
						leftBorder={counter == 1}
						rightBorder={counter == 3}
						topBorder={topBorder}
						bottomBorder={bottomBorder}
						onSquareClick={handleSquareClick}
						key={mySquare.coord} />
				)
			})}
		</div>
	)
}





function SquareElement({ square, leftBorder, rightBorder, topBorder, bottomBorder, onSquareClick }: SquareProps) {

	return (
		<div
			onClick={(event) => { if (square.isWritable()) { onSquareClick(square, event.clientX, event.clientY) } }}
			className={`
				${styles.square} 
				${topBorder ? styles.borderTop : ''}
				${bottomBorder ? styles.borderBottom : ''}
				${rightBorder ? styles.borderRight : ''}
				${leftBorder ? styles.borderLeft : ''}
				${square.isFilled() ? styles.filled : square.isWritable() ? styles.writable : ''}
			`}
		>
			<div className={styles.value}>{square.isEmpty() ? '' : square.getValue()}</div>
		</div>
	)
}

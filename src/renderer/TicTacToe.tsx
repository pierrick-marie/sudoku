'use client';

import { useState } from 'react';

import styles from './tictactoe.module.scss';

export default function TicTacToe() {

	const [currentMove, setCurrentMove] = useState<number>(0);
	const [history, setHistory] = useState<Array<any>>([Array(9).fill(null)]);

	function handlePlay(nextSquares: number) {
		let newHistory;
		const nextMove = currentMove + 1;

		if (history.length > nextMove) {
			newHistory = [...history.slice(0, nextMove), nextSquares];
		} else {
			newHistory = [...history.slice(), nextSquares];
		}

		setCurrentMove(nextMove);
		setHistory(newHistory);
	}

	function cancelLastMove() {
		if (history.length > 1 && null == calculateWinner(history[history.length - 1])) {
			setCurrentMove(history.length - 2);
			const newHistory = history.slice(0, -1);
			setHistory(newHistory);
		}
	}

	function jumpTo(i: number) {
		if (null == calculateWinner(history[history.length - 1])) {
			setCurrentMove(i);
		}
	}

	function handleNewGame() {
		setCurrentMove(0);
		setHistory([Array(9).fill(null)]);
	}

	function lastMoves() {

		return (
			history.map((element, move) => {

				if (move > 0) {
					return (
						<li key={move}>
							<Jump moveId={move} onJumpClick={() => jumpTo(move)} />
						</li>
					);
				}
			})
		);
	}

	const currentSquares = history[currentMove];
	const winner = calculateWinner(currentSquares);
	let xIsNext = getXIsNext(currentMove);
	let status;

	if (winner) {
		status = "Winner: " + winner;
	} else {
		status = "Next player: " + (xIsNext ? 'X' : 'O');
	}

	return (
		<div className={styles.game}>
			<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

			<div className={styles.control}>
				<h2 className={styles.winner}>{status}</h2>

				<button className={styles.cancel}
					onClick={cancelLastMove}>
					Cancel
				</button>

				<button className={styles.cancel}
					onClick={handleNewGame}>
					New game!
				</button>

				<ol className={styles.history}>
					{lastMoves()}
				</ol>
			</div>
		</div>
	)
}

interface MyJumpProps {
	moveId: number;
	onJumpClick: any;
}


function Jump({ moveId, onJumpClick }: MyJumpProps) {

	return (
		<button className={styles.action}
			onClick={onJumpClick}>
			Jump to move {moveId}
		</button>
	)
}

interface MyBoardProps {
	xIsNext: boolean;
	/** Whether the button can be interacted with */
	squares: Array<string>;

	onPlay: any
}

function Board({ xIsNext, squares, onPlay }: MyBoardProps) {

	function handleClick(i: number) {

		if (squares[i] || calculateWinner(squares)) {
			return;
		}

		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = 'X';
		} else {
			nextSquares[i] = 'O';
		}

		onPlay(nextSquares);
	}

	return (
		<div className={styles.board}>
			<div className={styles.row}>
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</div>
			<div className={styles.row}>
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</div>
			<div className={styles.row}>
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</div>
		</div>
	)
}

interface MySquareProps {
	value: string;
	onSquareClick: any
}

function Square({ value, onSquareClick }: MySquareProps) {

	return (
		<button className={styles.square}
			onClick={onSquareClick}>
			<div className={styles.button}>
				{value}
			</div>
		</button>
	)
}

function getXIsNext(currentMove: number) {
	if (currentMove % 2) {
		return false;
	} else {
		return true;
	}
}

function calculateWinner(squares: Array<string>) {

	const winnerLines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < winnerLines.length; i++) {
		const [a, b, c] = winnerLines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
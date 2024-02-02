
export const EMPTY_SQUARE_VALUE = -1;

export enum SquareStatus {
	Default,	// User can not change its value
	Writable,	// user can change its value (empty when game start) 
	Filled,	// User has changed its value (may be ok, or not ;)
}

export class Square {

	coord: number;
	value: number;
	status: SquareStatus;

	constructor(coord: number) {
		this.coord = coord;
		this.value = EMPTY_SQUARE_VALUE;
		this.status = SquareStatus.Default;
	}

	isEmpty(): boolean {
		return EMPTY_SQUARE_VALUE === this.value;
	}

	reset() {
		this.value = EMPTY_SQUARE_VALUE;
		this.status = SquareStatus.Default;
	}
}
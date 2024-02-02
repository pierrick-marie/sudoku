
export const EMPTY_SQUARE_VALUE = -1;

export enum SquareStatus {
	Default,	// User can not change its value
	Writable,	// user can change its value (empty when game start) 
	Filled,	// User has changed its value (may be ok, or not ;)
}

export class Square {

	public readonly coord: number;
	public value: number;
	public status: SquareStatus;

	public constructor(coord: number) {
		this.coord = coord;
		this.value = EMPTY_SQUARE_VALUE;
		this.status = SquareStatus.Default;
	}

	public isEmpty(): boolean {
		return EMPTY_SQUARE_VALUE === this.value;
	}

	public reset() {
		this.value = EMPTY_SQUARE_VALUE;
		this.status = SquareStatus.Default;
	}
}
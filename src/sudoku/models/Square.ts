
const EMPTY_SQUARE_VALUE = -1;

enum SquareStatus {
	ReadOnly,	// User can not change its value
	Writable,	// user can change its value (empty when game start) 
	Filled,	// User has changed its value (may be ok, or not ;)
}

export class Square {

	public readonly coord: number;
	private value: number;
	private status: SquareStatus;

	public constructor(coord: number) {
		this.coord = coord;

		this.value = EMPTY_SQUARE_VALUE;
		this.status = SquareStatus.Writable;
	}

	public isEmpty(): boolean {
		return EMPTY_SQUARE_VALUE === this.value;
	}

	public isReadOnly(): boolean {
		return this.status === SquareStatus.ReadOnly;
	}

	public isWritable(): boolean {
		return this.status === SquareStatus.Writable;
	}

	public isFilled(): boolean {
		return this.status === SquareStatus.Filled;
	}

	public reset() {
		this.value = EMPTY_SQUARE_VALUE;
		this.status = SquareStatus.Writable;
	}

	public defaultValue(value: number) {
		this.value = value;
		this.status = SquareStatus.ReadOnly;
	}

	public setValue(value: number) {
		this.value = value;
		this.status = SquareStatus.Filled;
	}

	public getValue(): number {
		return this.value;
	}

	public getStatus(): SquareStatus {
		return this.status;
	}
}
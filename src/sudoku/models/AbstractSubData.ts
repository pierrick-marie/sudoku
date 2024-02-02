import { Square } from './Square';

const DEFAULT_VALUES: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class AbstractSubData {
	
	id: number;
	squares: Square[];

	constructor(id: number) {
		this.id = id;
		this.squares = [];
	}

	getValues(): number[] {
		const values: number[] = [];

		this.squares.forEach((square) => {
			values.push(square.value);
		});

		return values;
	}

	isOk(): boolean {

		const values: number[] = this.getValues();

		return 9 === values.length && this.checkValues(values); 
	}

	checkValues(values: number[]): boolean {
	
		return DEFAULT_VALUES.every((value: number) => {
			return values.includes(value);
		})
	}
}
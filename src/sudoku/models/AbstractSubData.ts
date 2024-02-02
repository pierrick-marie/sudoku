import { Square } from './Square';

const DEFAULT_VALUES: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class AbstractSubData {
	
	public readonly id: number;
	public squares: Square[];

	public constructor(id: number) {
		this.id = id;
		this.squares = [];
	}

	public getValues(): number[] {
		const values: number[] = [];

		this.squares.forEach((square) => {
			values.push(square.value);
		});

		return values;
	}

	public isOk(): boolean {

		const values: number[] = this.getValues();

		return 9 === values.length && this.checkValues(values); 
	}

	private checkValues(values: number[]): boolean {
	
		return DEFAULT_VALUES.every((value: number) => {
			return values.includes(value);
		})
	}
}
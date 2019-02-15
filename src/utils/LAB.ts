import martix from 'matrix-multiplication';

export interface IRGBColor {
	R: number;
	G: number;
	B: number;
}

export interface ILABColor {
	L: number;
	A: number;
	B: number;
}

const g = (x: number): number => {
	if(x >= 0.04045) {
		return Math.pow((x + 0.055) / 1.055, 2.4);
	}
	return x / 12.92;
};

const f = (x: number): number => {
	if(x >= 0.008856) {
		return Math.pow(x , (1/3));
	} else if (x >= 0 && x <= 0.008856) {
		return (7.787 * x) + (16 / 116);
	}
	debugger;
};

export const RGBToLAB = (color: IRGBColor): ILABColor => {
	const mul = martix()(3);
	const constants = [
		0.412453, 0.357580, 0.180423,
		0.212671, 0.715160, 0.072169,
		0.019334, 0.119193, 0.950227
	];

	const ns = [g(color.R / 255) * 100, g(color.G / 255) * 100, g(color.B / 255) * 100];

	const res = mul(constants, ns);
	const LAB: ILABColor = {
		L: 116 * f(res[1] / 100) - 16,
		A: 500 * (f(res[0] / 95.047) - f(res[1] / 100)),
		B: 200 * (f(res[1] / 100) - f(res[2] / 108.883)),
	};
	
	return LAB;
};
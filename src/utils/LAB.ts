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

const gi = (x: number): number => {
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

	const ns = [gi(color.R / 255) * 100, gi(color.G / 255) * 100, gi(color.B / 255) * 100];

	const res = mul(constants, ns);
	const LAB: ILABColor = {
		L: 116 * f(res[1] / 100) - 16,
		A: 500 * (f(res[0] / 95.047) - f(res[1] / 100)),
		B: 200 * (f(res[1] / 100) - f(res[2] / 108.883)),
	};
	
	return LAB;
};

export const LABtoRGB = (color: ILABColor): IRGBColor => {
	color.A = parseFloat(color.A.toString());
	color.B = parseFloat(color.B.toString());
	color.L = parseFloat(color.L.toString());

	var y = (color.L + 16) / 116;
	var x = color.A / 500 + y;
	var z = y - color.B / 200;
	var r, g, b;

	x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16 / 116) / 7.787);
	y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16 / 116) / 7.787);
	z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16 / 116) / 7.787);

	r = x *  3.2404542 + y * -1.5371385 + z * -0.4985314;
	g = x * -0.9692660 + y *  1.8760108 + z *  0.0415560;
	b = x *  0.0556434 + y * -0.2040259 + z *  1.0572252;

	r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : 12.92 * r;
	g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : 12.92 * g;
	b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : 12.92 * b;
	
	return {
		R: r * 255,
		G: g * 255,
		B: b * 255
	};
};
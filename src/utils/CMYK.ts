export interface ICMYKColor {
	C: number;
	M: number;
	Y: number;
	K: number;
}

export interface IRGBColor {
	R: number;
	G: number;
	B: number;
}

export const RGBtoCMYK = (color: IRGBColor): ICMYKColor => {
	let targetColor: ICMYKColor = {
		C: 0,
		M: 0,
		Y: 0,
		K: 0,
	};

	const normalR = color.R / 255;
	const normalG = color.G / 255;
	const normalB = color.B / 255;

	targetColor.K = Math.min(1 - normalR, 1 - normalG, 1 - normalB);
	if (targetColor.K === 1) {
		targetColor.C = 0;
		targetColor.M = 0;
		targetColor.Y = 0;
	} else {
		targetColor.C = (1 - normalR - targetColor.K) / (1 - targetColor.K);
		targetColor.M = (1 - normalG - targetColor.K) / (1 - targetColor.K);
		targetColor.Y = (1 - normalB - targetColor.K) / (1 - targetColor.K);
	}

	return targetColor;
};

export const CMYKtoRGB = (color: ICMYKColor): IRGBColor => {
	let targetColor: IRGBColor = {
		R: 0,
		G: 0,
		B: 0,
	};

	targetColor.R = 255 * (1 - color.C) * (1 - color.K);
	targetColor.G = 255 * (1 - color.M) * (1 - color.K);
	targetColor.B = 255 * (1 - color.Y) * (1 - color.K);

	return targetColor;
};
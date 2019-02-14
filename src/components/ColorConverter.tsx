import * as React from 'react';
import { ColorPicker, TextField } from 'office-ui-fabric-react/lib/index';
import { IColor } from 'office-ui-fabric-react/lib/Color';
import './styles.css';

export interface IColorConverter {
  colorRGB: IRGBColor;
  colorCMYK: ICMYKColor;
}

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

class ColorConverter extends React.Component<{}, IColorConverter> {
  constructor() {
    super();

    this.state = {
      colorRGB: {
        R: 255,
        G: 0,
        B: 0
      },
      colorCMYK: {
        C: 0,
        M: 0,
        Y: 0,
        K: 0,
      }
    };
  }

  private colorToString(color: IRGBColor): string {
    return Object.values(color).map(c => this.componentToHex(c)).join('');
  }

  private RGBtoCMYK (color: IRGBColor): ICMYKColor {
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
    targetColor.C = (1 - normalR - targetColor.K) / (1 - targetColor.K);
    targetColor.M = (1 - normalG - targetColor.K) / (1 - targetColor.K);
    targetColor.Y = (1 - normalB - targetColor.K) / (1 - targetColor.K);

    return targetColor;
  }

  private CMYKtoRGB (color: ICMYKColor): IRGBColor {
    let targetColor: IRGBColor = {
      R: 0,
      G: 0,
      B: 0,
    };

    targetColor.R = 255 * (1 - color.C) * (1 - color.K);
    targetColor.G = 255 * (1 - color.M) * (1 - color.K);
    targetColor.B = 255 * (1 - color.Y) * (1 - color.K);

    return targetColor;
  }

  private componentToHex = c => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  private onColorChange = (color: string, colorObject: IColor) => {
    const RGB: IRGBColor = {
      R: colorObject.r,
      G: colorObject.g,
      B: colorObject.b,
    };
    console.log(this.RGBtoCMYK(RGB));
    // this.setState({
    //   colorCMYK: this.RGBtoCMYK(RGB)
    // });
  }

  public render() {
    const { colorRGB, colorCMYK } = this.state;
    
    return (
      <div>
          <ColorPicker
            className="pb-0"
            color={`#${this.colorToString(colorRGB)}`}
            alphaSliderHidden={true}
            onColorChanged={this.onColorChange}
          />
          <div className="container">
            <TextField label="Cyan"
              value={colorCMYK.C.toString()}
            />
            <TextField label="Magenta"
              value={colorCMYK.M.toString()}
            />
            <TextField label="Yellow"
              value={colorCMYK.Y.toString()}
            />
            <TextField label="Key"
              value={colorCMYK.K.toString()}
            />
          </div>
          <div className="container">
            <TextField label="L" />
            <TextField label="A" />
            <TextField label="B" />
          </div>
      </div>
    );
  }
}

export default ColorConverter;

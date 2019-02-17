import * as React from 'react';
import { ColorPicker, TextField } from 'office-ui-fabric-react/lib/index';
import { IColor } from 'office-ui-fabric-react/lib/Color';
import  {IRGBColor, ICMYKColor, CMYKtoRGB, RGBtoCMYK} from '../utils/CMYK';
import {RGBToLAB, ILABColor} from '../utils/LAB';
import './styles.css';

export interface IColorConverter {
  colorRGB: IRGBColor;
  colorCMYK: ICMYKColor;
  colorLAB: ILABColor;
}

class ColorConverter extends React.Component<{}, IColorConverter> {
  private flag: boolean = true;
  constructor() {
    super();

    this.state = {
      colorRGB: {
        R: 0,
        G: 0,
        B: 0
      },
      colorCMYK: {
        C: 0,
        M: 0,
        Y: 0,
        K: 0,
      },
      colorLAB: {
        L: 0,
        A: 0,
        B: 0,
      }
    };
  }

  private colorToString(color: IRGBColor): string {
    return Object.values(color).map(c => this.componentToHex(parseInt(c))).join('');
  }

  private onChangeCMYK = (ev: any, value: string) => {
    let color = this.state.colorCMYK;
    const component = ev.target.id;
    this.flag = false;
    if(!value) {
      color[component] = 0;
      setTimeout(() => {this.flag = true;}, 100);
      const RGB = CMYKtoRGB(color);
      const LAB = RGBToLAB(RGB);
      this.setState({
        colorCMYK: color,
        colorRGB: RGB,
        colorLAB: LAB,
      });
    } else {
      if(value.split('.').length > 2) {
        color[component] = value.slice(0, -1);
        setTimeout(() => {this.flag = true;}, 100);
        const RGB = CMYKtoRGB(color);
        const LAB = RGBToLAB(RGB);
        this.setState({
          colorCMYK: color,
          colorRGB: RGB,
          colorLAB: LAB,
        });
      } else {
        if(value.indexOf('.') === -1) {
          color[component] = parseFloat(value);
        } else {
          color[component] = value;
        }
        setTimeout(() => {this.flag = true;}, 100);
        const RGB = CMYKtoRGB(color);
        const LAB = RGBToLAB(RGB);
        this.setState({
          colorCMYK: color,
          colorRGB: RGB,
          colorLAB: LAB,
        });
      }
    }
  }

  private componentToHex = (c): number => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  private onColorChange = (color: string, colorObject: IColor) => {
    const RGB: IRGBColor = {
      R: colorObject.r,
      G: colorObject.g,
      B: colorObject.b,
    };
    if(this.flag) {
      this.setState({
        colorRGB: RGB,
        colorCMYK: RGBtoCMYK(RGB),
        colorLAB: RGBToLAB(RGB)
      });
    } else {
      this.setState({
        colorRGB: RGB,
      });
    }
  }

  private onChangeLAB = (ev: any, value: string) => {
    let color = this.state.colorLAB;
    const component = ev.target.id;
    color[component] = parseFloat(value);
      this.setState({
        colorLAB: color,
        // colorRGB: CMYKtoRGB(color)
      });
  }

  public render() {
    const { colorRGB, colorCMYK, colorLAB } = this.state;

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
              id="C"
              value={colorCMYK.C.toString().slice(0, 4)}
              onChange={this.onChangeCMYK}
            />
            <TextField label="Magenta"
              id="M"
              value={colorCMYK.M.toString().slice(0, 4)}
              onChange={this.onChangeCMYK}
            />
            <TextField label="Yellow"
              id="Y"
              value={colorCMYK.Y.toString().slice(0, 4)}
              onChange={this.onChangeCMYK}
            />
            <TextField label="Key"
              id="K"
              value={colorCMYK.K.toString().slice(0, 4)}
              onChange={this.onChangeCMYK}
            />
          </div>
          <div className="container">
            <TextField label="L"
              id="L"
              value={colorLAB.L.toString().slice(0, colorLAB.L.toString().indexOf('.') !== -1 ? colorLAB.L.toString().indexOf('.') + 3 : 2)}
              onChange={this.onChangeLAB}
            />
            <TextField label="A"
              id="A"
              value={colorLAB.A.toString().slice(0, colorLAB.L.toString().indexOf('.') !== -1 ? colorLAB.A.toString().indexOf('.') + 3 : 2)}
              onChange={this.onChangeLAB}
            />
            <TextField label="B"
              id="B"
              value={colorLAB.B.toString().slice(0, colorLAB.L.toString().indexOf('.') !== -1 ? colorLAB.B.toString().indexOf('.') + 3 : 2)}
              onChange={this.onChangeLAB}
            />
          </div>
      </div>
    );
  }
}

export default ColorConverter;

import * as React from 'react';
import { ColorPicker, TextField } from 'office-ui-fabric-react/lib/index';
import { IColor } from 'office-ui-fabric-react/lib/Color';
import  {IRGBColor, ICMYKColor, CMYKtoRGB, RGBtoCMYK} from '../utils/CMYK';
import {RGBToLAB, ILABColor, LABtoRGB} from '../utils/LAB';
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble';
import './styles.css';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

export interface IColorConverter {
  colorRGB: IRGBColor;
  colorCMYK: ICMYKColor;
  colorLAB: ILABColor;
  isTeachingBubbleVisible: boolean;
}

class ColorConverter extends React.Component<{}, IColorConverter> {
  private CMYKflag: boolean = true;
  private LABflag: boolean = true;
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
      },
      isTeachingBubbleVisible: false
    };

    this._onDismiss = this._onDismiss.bind(this);
  }

  private colorToString(color: IRGBColor): string {
    return Object.values(color).map(c => this.componentToHex(parseInt(c))).join('');
  }

  private onChangeCMYK = (ev: any, value: string) => {
    console.log('^^^');
    let color = this.state.colorCMYK;
    const component = ev.target.id;
    this.CMYKflag = false;
    if(!value) {
      color[component] = 0;
      setTimeout(() => {this.CMYKflag = true;}, 100);
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
        setTimeout(() => {this.CMYKflag = true;}, 100);
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
        setTimeout(() => {this.CMYKflag = true;}, 100);
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
    if(this.CMYKflag && this.LABflag) {
      this.setState({
        colorRGB: RGB,
        colorCMYK: RGBtoCMYK(RGB),
        colorLAB: RGBToLAB(RGB)
      });
    } 
    if (this.LABflag  && !this.CMYKflag) {
      this.setState({
        colorRGB: RGB,
        colorLAB: RGBToLAB(RGB),
      });
    }
    if (!this.LABflag  && this.CMYKflag) {
      console.log(RGB, RGBtoCMYK(RGB));
      this.setState({
        colorRGB: RGB,
        colorCMYK: RGBtoCMYK(RGB),
      });
    } else {
      this.setState({
        colorRGB: RGB,
      });
    }
  }

  private parseRGB(color: IRGBColor): IRGBColor {
    if (color.R < 0 || color.G < 0 || color.B < 0) {
      this._onDismiss();
    }
    return {
      R: color.R > 0 ? color.R : 0,
      G: color.G > 0 ? color.G : 0,
      B: color.B > 0 ? color.B : 0
    };
  }

  private onChangeLAB = (ev: any, value: string) => {
    let color = this.state.colorLAB;
    const component = ev.target.id;
    this.LABflag = false;
    if(!value || value === '-') {
      color[component] = 0;
      setTimeout(() => {this.LABflag = true;}, 100);
      const RGB = this.parseRGB(LABtoRGB(color));
      const CMYK = RGBtoCMYK(RGB);
      this.setState({
        colorCMYK: CMYK,
        colorRGB: RGB,
        colorLAB: color,
      });
    } else {
      if(value.split('.').length > 2) {
        color[component] = value.slice(0, -1);
        setTimeout(() => {this.LABflag = true;}, 100);
        const RGB = this.parseRGB(LABtoRGB(color));
        const CMYK = RGBtoCMYK(RGB);
        this.setState({
          colorCMYK: CMYK,
          colorRGB: RGB,
          colorLAB: color,
        });
      } else {
        if(value.indexOf('.') === -1) {
          color[component] = parseFloat(value);
        } else {
          color[component] = value;
        }
        setTimeout(() => {this.LABflag = true;}, 100);
        const RGB = this.parseRGB(LABtoRGB({L: color.L, A: color.A, B: color.B}));
        const CMYK = RGBtoCMYK(RGB);
        this.setState({
          colorCMYK: CMYK,
          colorRGB: RGB,
          colorLAB: color,
        });
      }
    }
  }

  private _menuButtonElement: HTMLElement;

  private _onDismiss(ev?: any): void {
    this.setState({
      isTeachingBubbleVisible: !this.state.isTeachingBubbleVisible
    });
  }

  public render() {
    const { colorRGB, colorCMYK, colorLAB, isTeachingBubbleVisible } = this.state;

    const exampleSecondaryButtonProps: IButtonProps = {
      children: 'Закрыть',
      onClick: this._onDismiss
    };

    return (
      <div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
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
                value={colorLAB.L.toString().slice(0, colorLAB.L.toString().indexOf('.') !== -1 ? colorLAB.L.toString().indexOf('.') + 3 : 3)}
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
          </div>
          <div style={{padding: '0 16px'}}>
            <div
              style={{
                width: '100%',
                height: '100px',
                marginTop: '40px',
                background: `#${this.colorToString(colorRGB)}`
              }}></div>
            </div>
            {isTeachingBubbleVisible ? (
              <div>
                <TeachingBubble
                  targetElement={this._menuButtonElement}
                  primaryButtonProps={exampleSecondaryButtonProps}
                  hasCondensedHeadline={true}
                  onDismiss={this._onDismiss}
                  headline="Переполнение LAB to RGB"
                />
              </div>
            ) : null}
            <div ref={menuButton => (this._menuButtonElement = menuButton!)}></div>
      </div>
    );
  }
}

export default ColorConverter;

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  /// SYNC COLORS WITH _variables.scss !!!!
  grayDark = '#666666'
  gray = '#939393'
  graySemi = '#E6E6E6'
  grayLight = '#FCFCFC'
  black = '#212121'
  blue = '#1E90FF'
  blueLight = '#4BA6FF'
  red = '#DF1642'
  redLight = '#E95C7B'
  yellow = '#FFBB38'
  yellowLight = '#FFCF74'
  green = '#26AE60'

  primaryLight = '#A29891'
  primaryLighter = '#C5BFBB'
  primaryLightest = '#E8E6E4'

  // bootstrap theme colors
  primary = '#4B382A'
  secondary = '#281F18'
  tertiary = '#181B31'
  success = this.primary
  info = this.blue
  warning = this.yellow
  danger = this.red
  light = this.grayLight
  dark = this.grayDark

  constructor() { }
}

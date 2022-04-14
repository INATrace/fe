import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { B2cRoutingModule } from './b2c-routing.module';
import { B2cPageComponent } from './b2c-page/b2c-page.component';
import { B2cIntroComponent } from './b2c-page/b2c-intro/b2c-intro.component';


@NgModule({
  declarations: [B2cPageComponent, B2cIntroComponent],
  imports: [
    CommonModule,
    B2cRoutingModule
  ]
})
export class B2cModule { }

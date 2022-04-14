import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';

@Component({
  selector: 'app-b2c-intro',
  templateUrl: './b2c-intro.component.html',
  styleUrls: ['./b2c-intro.component.scss']
})
export class B2cIntroComponent implements OnInit {

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent
  ) { }

  productName: string;

  ngOnInit(): void {
    // Load name from fields
    for (const item of this.b2cPage.fields) {
      if (item.name === 'name') {
        this.productName = item.value;
      }
    }
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';

@Component({
  selector: 'app-b2c-journey',
  templateUrl: './b2c-journey.component.html',
  styleUrls: ['./b2c-journey.component.scss']
})
export class B2cJourneyComponent implements OnInit {

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent
  ) { }

  productName: string;

  headerColor: string;

  ngOnInit(): void {
    this.productName = this.b2cPage.productName;
    this.headerColor = this.b2cPage.headerColor;
  }

}

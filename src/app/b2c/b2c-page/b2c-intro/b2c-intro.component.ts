import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-b2c-intro',
  templateUrl: './b2c-intro.component.html',
  styleUrls: ['./b2c-intro.component.scss']
})
export class B2cIntroComponent implements OnInit {

  uuid: string;
  qrTag: string;

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent,
      private router: Router
  ) {
    this.uuid = b2cPage.uuid;
    this.qrTag = b2cPage.qrTag;
  }

  productName: string;

  ngOnInit(): void {
    this.productName = this.b2cPage.productName;
  }

  openJourney() {
    this.router.navigate(['/', 'b2c', this.uuid, this.qrTag, 'journey']);
  }

}

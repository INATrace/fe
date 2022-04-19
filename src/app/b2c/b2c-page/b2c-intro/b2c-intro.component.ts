import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { Router } from '@angular/router';
import { ApiBusinessToCustomerSettings } from '../../../../api/model/apiBusinessToCustomerSettings';

@Component({
  selector: 'app-b2c-intro',
  templateUrl: './b2c-intro.component.html',
  styleUrls: ['./b2c-intro.component.scss']
})
export class B2cIntroComponent implements OnInit {

  uuid: string;
  qrTag: string;
  b2cSettings: ApiBusinessToCustomerSettings;

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent,
      private router: Router
  ) {
    this.uuid = b2cPage.uuid;
    this.qrTag = b2cPage.qrTag;
    this.b2cSettings = b2cPage.b2cSettings;
  }

  productName: string;

  ngOnInit(): void {
    this.productName = this.b2cPage.productName;
  }

  openJourney() {
    this.router.navigate(['/', 'b2c', this.uuid, this.qrTag, 'journey']);
  }

}

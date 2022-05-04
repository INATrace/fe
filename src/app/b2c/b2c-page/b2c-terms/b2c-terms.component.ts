import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { ApiBusinessToCustomerSettings } from "../../../../api/model/apiBusinessToCustomerSettings";

@Component({
  selector: 'app-b2c-terms',
  templateUrl: './b2c-terms.component.html',
  styleUrls: ['./b2c-terms.component.scss']
})
export class B2cTermsComponent implements OnInit {

  b2cSettings: ApiBusinessToCustomerSettings;

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent
  ) {
    this.b2cSettings = b2cPage.b2cSettings;
  }

  title = $localize`:@@frontPage.terms.title:Terms of use`;
  termsText: string;

  ngOnInit(): void {
    this.termsText = this.b2cPage.termsText;
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { B2cPageComponent } from '../b2c-page.component';
import { ApiBusinessToCustomerSettings } from "../../../../api/model/apiBusinessToCustomerSettings";

@Component({
  selector: 'app-b2c-privacy',
  templateUrl: './b2c-privacy.component.html',
  styleUrls: ['./b2c-privacy.component.scss']
})
export class B2cPrivacyComponent implements OnInit {

  b2cSettings: ApiBusinessToCustomerSettings;

  constructor(
      @Inject(B2cPageComponent) private b2cPage: B2cPageComponent
  ) {
    this.b2cSettings = b2cPage.b2cSettings;
  }

  title = $localize`:@@frontPage.privacy.title:Privacy policy`;
  privacyText: string;

  ngOnInit(): void {
    this.privacyText = this.b2cPage.privacyText;
  }

}

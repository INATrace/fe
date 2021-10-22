import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyCustomersService } from '../../../../shared-services/company-customers.service';
import { CompanyFacilitiesService } from '../../../../shared-services/company-facilities.service';
import { GradeAbbreviationCodebook } from '../../../../shared-services/grade-abbreviation-codebook';

@Component({
  selector: 'app-global-order-details',
  templateUrl: './global-order-details.component.html',
  styleUrls: ['./global-order-details.component.scss']
})
export class GlobalOrderDetailsComponent implements OnInit {

  form: FormGroup;
  submitted = false;

  title: string = null;

  update = true;

  userLastChanged = null;

  companyCustomerCodebook: CompanyCustomersService;

  outputFacilitiesCodebook: CompanyFacilitiesService;
  outputFacilityForm = new FormControl(null, Validators.required);

  gradeAbbreviationCodebook: GradeAbbreviationCodebook;

  constructor() { }

  ngOnInit(): void {
  }

}

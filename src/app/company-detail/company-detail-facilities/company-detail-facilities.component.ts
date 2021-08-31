import { Component, OnInit } from '@angular/core';
import { CompanyDetailTabManagerComponent } from '../company-detail-tab-manager/company-detail-tab-manager.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company-detail-facilities',
  templateUrl: './company-detail-facilities.component.html',
  styleUrls: ['./company-detail-facilities.component.scss']
})
export class CompanyDetailFacilitiesComponent extends CompanyDetailTabManagerComponent implements OnInit {

  rootTab = 2;

  title = $localize`:@@companyDetailFacilities.title.edit:Company facilities`;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
  ) {
    super(router, route);
  }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return true;
  }

}

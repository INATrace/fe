import { Component, OnInit } from '@angular/core';
import { CompanyDetailTabManagerComponent } from '../company-detail-tab-manager/company-detail-tab-manager.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityControllerService } from '../../../api/api/facilityController.service';
import { first } from 'rxjs/operators';
import { ApiFacility } from '../../../api/model/apiFacility';

@Component({
  selector: 'app-company-detail-facilities',
  templateUrl: './company-detail-facilities.component.html',
  styleUrls: ['./company-detail-facilities.component.scss']
})
export class CompanyDetailFacilitiesComponent extends CompanyDetailTabManagerComponent implements OnInit {

  rootTab = 2;

  title = $localize`:@@companyDetailFacilities.title.edit:Company facilities`;

  allFacilities = 0;
  displayedFacilities = 0;

  public companyId;
  public facilities: ApiFacility[];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected facilityControllerService: FacilityControllerService
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params.id;
    this.facilityControllerService.getFacilityListUsingGET('FETCH').pipe(first()).subscribe(res => {
      this.facilities = res.data.items;
      this.allFacilities = this.facilities.length;
      this.displayedFacilities = this.facilities.length;
    });
  }

  canDeactivate(): boolean {
    return true;
  }

  newFacility() {
    this.router.navigate(['companies', this.cId, 'facilities', 'add']);
  }

}

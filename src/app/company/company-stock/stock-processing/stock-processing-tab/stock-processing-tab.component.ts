import { Component, OnInit } from '@angular/core';
import { StockCoreTabComponent } from '../../stock-core/stock-core-tab/stock-core-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';
import { FacilityControllerService } from '../../../../../api/api/facilityController.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-stock-processing-tab',
  templateUrl: './stock-processing-tab.component.html',
  styleUrls: ['./stock-processing-tab.component.scss']
})
export class StockProcessingTabComponent extends StockCoreTabComponent implements OnInit {

  rootTab = 1;

  allProcessFacilities = 0;
  showedProcessFacilities = 0;

  reloadProcessingFacilitiesListPing$ = new BehaviorSubject<boolean>(false);

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected globalEventManager: GlobalEventManagerService,
    protected facilityControllerService: FacilityControllerService
  ) {
    super(router, route, globalEventManager, facilityControllerService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  newProcessingOrder() {
    this.router.navigate(['my-stock', 'processing', 'NEW', 'facility', 'NEW', 'new']).then();
  }

  public onCountAll(event) {
    this.allProcessFacilities = event;
  }

  public onShow(event) {
    this.showedProcessFacilities = event;
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/api-chain/api/product.service';
import { ProductControllerService } from 'src/api/api/productController.service';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { ProductLabelStakeholdersComponent } from '../product-label-stakeholders.component';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';

@Component({
  selector: 'app-stakeholders-value-chain',
  templateUrl: './stakeholders-value-chain.component.html',
  styleUrls: ['./stakeholders-value-chain.component.scss']
})
export class StakeholdersValueChainComponent extends ProductLabelStakeholdersComponent implements OnInit {

  rootTab = 0;

  constructor(
    protected productController: ProductControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    protected modalService: NgbModalImproved,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(productController, globalEventsManager, modalService, route, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/api-chain/api/product.service';
import { ProductControllerService } from 'src/api/api/productController.service';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { ProductLabelStakeholdersComponent } from '../product-label-stakeholders.component';
import { UserCustomerService } from 'src/api-chain/api/userCustomer.service';

@Component({
  selector: 'app-stakeholders-value-chain',
  templateUrl: './stakeholders-value-chain.component.html',
  styleUrls: ['../product-label-stakeholders.component.scss']
})
export class StakeholdersValueChainComponent extends ProductLabelStakeholdersComponent {

  rootTab = 0

  constructor(
    protected productController: ProductControllerService,
    protected globalEventsManager: GlobalEventManagerService,
    protected modalService: NgbModalImproved,
    protected route: ActivatedRoute,
    protected router: Router,
    public chainOrganizationCodebook: OrganizationsCodebookService,
    protected chainProductService: ProductService,
    public chainUserCustomer: UserCustomerService
  ) {
    super(productController, globalEventsManager, modalService, route, router, chainOrganizationCodebook, chainProductService, chainUserCustomer)
  }
}

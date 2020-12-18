import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityService } from 'src/api-chain/api/facility.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { PaymentsService } from 'src/api-chain/api/payments.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { UserControllerService } from 'src/api/api/userController.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { OrganizationsCodebookService } from 'src/app/shared-services/organizations-codebook.service';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { StockTabCore } from '../../stock-core/stock-tab-core/stock-tab-core.component';

@Component({
  selector: 'app-stock-configuration-tab',
  templateUrl: './stock-configuration-tab.component.html',
  styleUrls: ['./stock-configuration-tab.component.scss']
})
export class StockConfigurationTabComponent extends StockTabCore {

  rootTab = 3;

  constructor(
    protected route: ActivatedRoute,
    protected chainProductService: ProductService,
    protected chainSemiProductService: SemiProductService,
    // protected tabCommunicationService: TabCommunicationService,
    // @Host() public authorizedLayout: AuthorisedLayoutComponent,
    protected router: Router,
    public chainOrganizationService: OrganizationService,
    public chainOrganizationCodebook: OrganizationsCodebookService,
    protected globalEventManager: GlobalEventManagerService,
    protected chainFacilityService: FacilityService,
    protected chainStockOrderService: StockOrderService,
    protected modalService: NgbModalImproved,
    protected codebookTranslations: CodebookTranslations,
    protected chainPaymentsContoller: PaymentsService,
    protected authService: AuthService,
    protected companyController: CompanyControllerService,
    protected userController: UserControllerService
  ) {
    super(route, chainProductService, chainSemiProductService, router, chainOrganizationService, chainOrganizationCodebook, globalEventManager, chainFacilityService, chainStockOrderService, modalService, codebookTranslations, chainPaymentsContoller, authService, companyController, userController)
  }

  newFacility() {
    this.router.navigate(['product-labels', this.productId, 'stock', 'configuration', 'facilities', 'organization', this.organizationId, 'new']);
  }

  newSemiProduct() {
    this.router.navigate(['product-labels', this.productId, 'stock', 'configuration', 'semi-products', 'new']);
  }

}

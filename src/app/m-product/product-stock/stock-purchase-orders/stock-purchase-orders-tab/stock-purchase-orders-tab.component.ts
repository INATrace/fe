import { Component, OnInit } from '@angular/core';
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
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { setSelectedIdFieldFromQueryParams } from 'src/shared/utils';
import { StockTabCoreComponent } from '../../stock-core/stock-tab-core/stock-tab-core.component';

@Component({
  selector: 'app-stock-purchase-orders-tab',
  templateUrl: './stock-purchase-orders-tab.component.html',
  styleUrls: ['./stock-purchase-orders-tab.component.scss']
})
export class StockPurchaseOrderTabComponent extends StockTabCoreComponent implements OnInit {

  rootTab = 0;

  constructor(
    protected route: ActivatedRoute,
    protected chainProductService: ProductService,
    protected chainSemiProductService: SemiProductService,
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
    super(
      route,
      chainProductService,
      chainSemiProductService,
      router,
      chainOrganizationService,
      chainOrganizationCodebook,
      globalEventManager,
      chainFacilityService,
      chainStockOrderService,
      modalService,
      codebookTranslations,
      chainPaymentsContoller,
      authService,
      companyController,
      userController);
  }

  ngOnInit() {
    super.ngOnInit();
    setSelectedIdFieldFromQueryParams(this, this.route, 'facilityId', this.facilityForStockOrderForm,
      this.facilityCodebook, (val) => this.facilityForStockOrderChanged(val)).then();
  }


}

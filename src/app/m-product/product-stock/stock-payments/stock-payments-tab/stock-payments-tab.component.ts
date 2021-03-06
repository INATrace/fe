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
import { dbKey } from 'src/shared/utils';
import { FacilityStockOrderSelectorForNewPaymentModalComponent } from '../../stock-core/facility-stock-order-selector-for-new-payment-modal/facility-stock-order-selector-for-new-payment-modal.component';
import { StockTabCore } from '../../stock-core/stock-tab-core/stock-tab-core.component';

@Component({
  selector: 'app-stock-payments-tab',
  templateUrl: './stock-payments-tab.component.html',
  styleUrls: ['./stock-payments-tab.component.scss']
})
export class StockPaymentsTabComponent extends StockTabCore {

  rootTab = 2;

  constructor(
    protected route: ActivatedRoute,
    protected chainProductService: ProductService,
    protected chainSemiProductService: SemiProductService,
    // protected tabCommunicationService: TabCommunicationService,
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


  newPayment() {
    this.createFacilityStockOrderSelectorModal();
  }

  async createFacilityStockOrderSelectorModal() {
    const modalRef = this.modalService.open(FacilityStockOrderSelectorForNewPaymentModalComponent, { centered: true });
    Object.assign(modalRef.componentInstance, {
      organizationId: this.organizationId,
    })
    let stockOrder = await modalRef.result;
    if (stockOrder) {
      this.router.navigate(['product-labels', this.productId, 'stock', 'payments', 'purchase-order', dbKey(stockOrder), 'new'])
    }
  }

}
